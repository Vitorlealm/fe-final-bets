export const API_BASE = 'http://localhost:3001'

export async function getJson(path) {
  return (await fetch(`${API_BASE}${path}`)).json()
}

export function send(path, method, body) {
  return fetch(`${API_BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export function del(path) {
  return fetch(`${API_BASE}${path}`, { method: 'DELETE' })
}
