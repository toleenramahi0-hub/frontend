import { getToken } from './tokenStorage'

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')

/**
 * Error thrown for any failed API call.
 * - status 0      → network / server unreachable
 * - status 422    → validation; `fields` maps field name → first message (Laravel format)
 * - other status  → `message` from the server when present
 */
export class ApiError extends Error {
  constructor(message, { status = 0, fields = {} } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fields = fields
  }
}

// Laravel returns { message, errors: { field: [msg, ...] } } for 422 responses.
function firstErrors(errors = {}) {
  return Object.fromEntries(Object.entries(errors).map(([key, msgs]) => [key, Array.isArray(msgs) ? msgs[0] : msgs]))
}

export async function apiRequest(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  const token = auth ? getToken() : null
  if (token) headers.Authorization = `Bearer ${token}`

  let response
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('network', { status: 0 })
  }

  if (response.status === 204) return null

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(data?.message || 'request_failed', {
      status: response.status,
      fields: firstErrors(data?.errors),
    })
  }

  return data
}
