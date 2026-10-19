// "Remember me" keeps the token in localStorage (survives browser restarts);
// otherwise it lives in sessionStorage and ends with the browser session.
const KEY = 'gx_token'

function safe(fn, fallback = null) {
  try {
    return fn()
  } catch {
    return fallback
  }
}

export function getToken() {
  return safe(() => localStorage.getItem(KEY) || sessionStorage.getItem(KEY))
}

export function setToken(token, remember) {
  clearToken()
  safe(() => (remember ? localStorage : sessionStorage).setItem(KEY, token))
}

export function clearToken() {
  safe(() => localStorage.removeItem(KEY))
  safe(() => sessionStorage.removeItem(KEY))
}
