// Camada base de acesso à API (json-server).
// Mantém o comportamento original dos fetch inline:
//  - getJson espelha exatamente `(await fetch(x)).json()` — não inspeciona res.ok nem lança em status != 2xx;
//  - send/del retornam o Response SEM consumir o body (os chamadores apenas dão await e ignoram a resposta).
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
