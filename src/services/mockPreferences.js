// Development-only mock of the preferences API, stored per user in localStorage.
import { ApiError } from './api'
import { currentMockUserId } from './mockAuth'

const KEY = 'gx_mock_preferences'

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? {}
  } catch {
    return {}
  }
}

function requireUser() {
  const userId = currentMockUserId()
  if (!userId) throw new ApiError('unauthenticated', { status: 401 })
  return userId
}

export async function get() {
  await delay(200)
  return { preferences: readAll()[requireUser()] ?? null }
}

export async function save(preferences) {
  await delay()
  const userId = requireUser()
  if (!preferences.categories?.length) {
    throw new ApiError('validation', { status: 422, fields: { categories: 'required' } })
  }
  localStorage.setItem(KEY, JSON.stringify({ ...readAll(), [userId]: preferences }))
  return { preferences }
}
