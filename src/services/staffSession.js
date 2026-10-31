/**
 * Front-end placeholder for admin / business-owner sessions until the backend's
 * staff auth (with its second factor) exists. Real authorisation must happen on
 * the server — this only decides which dashboard the browser shows.
 */
const KEY = 'gx_staff_session'

export function startStaffSession(role, id, remember) {
  const store = remember ? localStorage : sessionStorage
  store.setItem(KEY, JSON.stringify({ role, id, at: Date.now() }))
}

export function getStaffSession() {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? sessionStorage.getItem(KEY))
  } catch {
    return null
  }
}

export function endStaffSession() {
  localStorage.removeItem(KEY)
  sessionStorage.removeItem(KEY)
}
