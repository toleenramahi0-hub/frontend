import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './authContextValue'
import { authService } from '../services/authService'
import { clearToken, getToken, setToken } from '../services/tokenStorage'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // 'loading' while restoring a saved session, then 'ready'.
  const [status, setStatus] = useState(() => (getToken() ? 'loading' : 'ready'))

  // UC-U04: restore the current user from a saved token.
  useEffect(() => {
    if (status !== 'loading') return
    authService
      .me()
      .then((data) => setUser(data.user))
      .catch(() => clearToken()) // expired/invalid token → act as signed out
      .finally(() => setStatus('ready'))
  }, [status])

  const login = useCallback(async ({ login, password, remember }) => {
    const data = await authService.login({ login, password, remember })
    setToken(data.token, remember)
    setUser(data.user)
    return data.user
  }, [])

  const register = useCallback(async (fields) => {
    const data = await authService.register(fields)
    setToken(data.token, false)
    setUser(data.user)
    return data.user
  }, [])

  // UC-U03: always clear local state, even if the server call fails (A1/A2).
  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } finally {
      clearToken()
      setUser(null)
    }
  }, [])

  const value = useMemo(
    () => ({ user, status, isAuthenticated: !!user, login, register, logout }),
    [user, status, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
