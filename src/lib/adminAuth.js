const RAW_API_BASE_URL =
  (import.meta.env.PROD
    ? import.meta.env.VITE_API_BASE_URL_PROD
    : import.meta.env.VITE_API_BASE_URL_DEV) || 'http://localhost:8787'

const API_BASE_URL = String(RAW_API_BASE_URL).replace(/\/+$/, '')

let cachedUser

function extractUser(payload) {
  if (!payload || typeof payload !== 'object') {
    return null
  }

  if (payload.user && typeof payload.user === 'object') {
    return payload.user
  }

  if (payload.username || payload.role) {
    return payload
  }

  return null
}

async function authRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  let payload = null
  const contentType = response.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    payload = await response.json()
  } else {
    payload = await response.text()
  }

  if (!response.ok) {
    const message =
      typeof payload === 'string'
        ? payload
        : payload?.message || 'No se pudo completar la solicitud de autenticacion.'

    const error = new Error(message)
    error.status = response.status
    error.payload = payload
    throw error
  }

  return payload
}

export async function signInAdmin({ username, password }) {
  const payload = await authRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })

  const user = extractUser(payload)

  if (!user || user.role !== 'admin') {
    await signOutAdmin()

    const error = new Error('No tienes permisos de administrador.')
    error.status = 403
    throw error
  }

  cachedUser = user
  return user
}

export async function signOutAdmin() {
  try {
    await authRequest('/api/auth/logout', {
      method: 'POST',
    })
  } catch (error) {
    if (![401, 403, 404].includes(error.status)) {
      throw error
    }
  }

  cachedUser = null
}

export async function getCurrentUser({ forceRefresh = false } = {}) {
  if (!forceRefresh && cachedUser !== undefined) {
    return cachedUser
  }

  try {
    const payload = await authRequest('/api/auth/me', {
      method: 'GET',
    })

    cachedUser = extractUser(payload)
    return cachedUser
  } catch (error) {
    if ([401, 403].includes(error.status)) {
      cachedUser = null
      return null
    }

    throw error
  }
}

export async function isAdminAuthenticated() {
  const user = await getCurrentUser()
  return Boolean(user && user.role === 'admin')
}
