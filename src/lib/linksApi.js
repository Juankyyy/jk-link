const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787'

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
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
  const links = await apiRequest('/api/links', { method: 'GET' })

  if (!Array.isArray(links)) {
    return []
  }

  return links.map((link) => ({
    name: link.name,
    url: link.url || link.value || '',
  }))
}

export async function createLink({ name, url }) {
  await apiRequest('/api/links', {
    method: 'POST',
    body: JSON.stringify({ name, url }),
  })
}

export async function deleteLink(name) {
  await apiRequest(`/api/links/${encodeURIComponent(name)}`, {
    method: 'DELETE',
  })
}

export async function updateLink({ currentName, name, url }) {
  try {
    await apiRequest(`/api/links/${encodeURIComponent(currentName)}`, {
      method: 'PUT',
      body: JSON.stringify({ name, url }),
    })
    return
  } catch (error) {
    if (![404, 405].includes(error.status)) {
      throw error
    }
  }

  await deleteLink(currentName)
  await createLink({ name, url })
}
