/**
 * Authentication API (UC-U01 Register, UC-U02 Login, UC-U03 Logout, UC-U04 View Current User).
 *
 * Expected Laravel (Sanctum) endpoints:
 *   POST /auth/register  { name, username, email, password, password_confirmation } → { user, token }
 *   POST /auth/login     { login, password, remember }                               → { user, token }
 *   POST /auth/logout                                                                → 204
 *   GET  /auth/me                                                                    → { user }
 *
 * Set VITE_USE_MOCK_API=true to use the in-browser mock until the backend is ready.
 */
import { apiRequest } from './api'
import * as mock from './mockAuth'

const useMock = import.meta.env.VITE_USE_MOCK_API === 'true'

const real = {
  register: (data) => apiRequest('/auth/register', { method: 'POST', body: data, auth: false }),
  login: (data) => apiRequest('/auth/login', { method: 'POST', body: data, auth: false }),
  logout: () => apiRequest('/auth/logout', { method: 'POST' }),
  me: () => apiRequest('/auth/me'),
}

export const authService = useMock ? mock : real
export const isMockApi = useMock
