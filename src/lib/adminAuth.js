const ADMIN_SESSION_KEY = 'jk-link-admin-session'
const ADMIN_ACCESS_KEY = import.meta.env.VITE_ADMIN_ACCESS_KEY || 'admin020304'

export const USING_DEFAULT_ADMIN_KEY = !import.meta.env.VITE_ADMIN_ACCESS_KEY

function getStorage() {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage
}

export function signInAdmin(accessKey) {
  const storage = getStorage()

  if (!storage || accessKey !== ADMIN_ACCESS_KEY) {
    return false
  }

  storage.setItem(ADMIN_SESSION_KEY, '1')
  return true
}

export function signOutAdmin() {
  const storage = getStorage()

  if (!storage) {
    return
  }

  storage.removeItem(ADMIN_SESSION_KEY)
}

export function isAdminAuthenticated() {
  const storage = getStorage()

  if (!storage) {
    return false
  }

  return storage.getItem(ADMIN_SESSION_KEY) === '1'
}
