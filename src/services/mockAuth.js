/**
 * Development-only mock of the auth API. It stores accounts in localStorage
 * and mirrors the Laravel response/error shapes so the UI code is identical
 * against the real backend. Never use this in production.
 */
import { ApiError } from './api'
import { getToken } from './tokenStorage'

const USERS_KEY = 'gx_mock_users'
const SESSIONS_KEY = 'gx_mock_sessions'

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))

function read(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

async function hash(password) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password))
  return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, '0')).join('')
}

function publicUser(user) {
  const { passwordHash: _omit, ...rest } = user
  return rest
}

function issueToken(userId) {
  const token = crypto.randomUUID()
  write(SESSIONS_KEY, { ...read(SESSIONS_KEY, {}), [token]: userId })
  return token
}

export async function register({ name, username, email, password }) {
  await delay()
  const users = read(USERS_KEY, [])
  const fields = {}
  if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
    fields.username = 'username_taken'
  }
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    fields.email = 'email_taken'
  }
  if (Object.keys(fields).length) throw new ApiError('validation', { status: 422, fields })

  const user = {
    id: crypto.randomUUID(),
    name,
    username,
    email,
    role: 'user',
    bio: '',
    avatarUrl: null,
    createdAt: new Date().toISOString(),
    passwordHash: await hash(password),
  }
  write(USERS_KEY, [...users, user])
  return { user: publicUser(user), token: issueToken(user.id) }
}

export async function login({ login, password }) {
  await delay()
  const id = login.toLowerCase()
  const user = read(USERS_KEY, []).find((u) => u.email.toLowerCase() === id || u.username.toLowerCase() === id)
  if (!user || user.passwordHash !== (await hash(password))) {
    throw new ApiError('invalid_credentials', { status: 401 })
  }
  return { user: publicUser(user), token: issueToken(user.id) }
}

export async function logout() {
  await delay(200)
  const sessions = read(SESSIONS_KEY, {})
  delete sessions[getToken()]
  write(SESSIONS_KEY, sessions)
  return null
}

export function currentMockUserId() {
  return read(SESSIONS_KEY, {})[getToken()] ?? null
}

export async function me() {
  await delay(200)
  const userId = currentMockUserId()
  const user = read(USERS_KEY, []).find((u) => u.id === userId)
  if (!user) throw new ApiError('unauthenticated', { status: 401 })
  return { user: publicUser(user) }
}
