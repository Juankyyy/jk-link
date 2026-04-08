const RAW_API_BASE_URL = import.meta.env.PROD
  ? ''
  : import.meta.env.VITE_API_BASE_URL_DEV || 'http://localhost:8787'

const API_BASE_URL = String(RAW_API_BASE_URL).replace(/\/+$/, '')

function normalizeDestinationUrl(url) {
  const trimmedUrl = String(url || '').trim()

  if (!trimmedUrl) {
    return ''
  }

  if (/^https?:\/\//i.test(trimmedUrl)) {
    return trimmedUrl
  }

  return `https://${trimmedUrl}`
}

async function apiRequest(path, options = {}) {
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
        : payload?.message || 'No se pudo completar la solicitud.'

    const error = new Error(message)
    error.status = response.status
    error.payload = payload
    throw error
  }

  return payload
}

export async function fetchLinks() {
  const links = await apiRequest(`/api/links?t=${Date.now()}`, {
    method: 'GET',
    cache: 'no-store',
  })

  if (!Array.isArray(links)) {
    return []
  }

  return links.map((link) => ({
    name: link.name,
    url: normalizeDestinationUrl(link.url || link.value || ''),
  }))
}

export async function resolveLinkDestination(name) {
  const normalizedName = String(name || '').trim()

  if (!normalizedName) {
    const error = new Error('Debes indicar un nombre de link válido.')
    error.status = 400
    throw error
  }

  const links = await fetchLinks()
  const match = links.find((link) => link.name === normalizedName)

  if (!match || !match.url) {
    const error = new Error('No se encontró el link solicitado.')
    error.status = 404
    throw error
  }

  return match.url
}

export async function createLink({ name, url }) {
  const normalizedUrl = normalizeDestinationUrl(url)

  await apiRequest('/api/links', {
    method: 'POST',
    body: JSON.stringify({ name, url: normalizedUrl }),
  })
}

export async function deleteLink(name) {
  await apiRequest(`/api/links/${encodeURIComponent(name)}`, {
    method: 'DELETE',
  })
}

export async function updateLink({ currentName, name, url }) {
  const normalizedUrl = normalizeDestinationUrl(url)

  try {
    await apiRequest(`/api/links/${encodeURIComponent(currentName)}`, {
      method: 'PUT',
      body: JSON.stringify({ name, url: normalizedUrl }),
    })
    return
  } catch (error) {
    if (![404, 405].includes(error.status)) {
      throw error
    }
  }

  await deleteLink(currentName)
  await createLink({ name, url: normalizedUrl })
}
