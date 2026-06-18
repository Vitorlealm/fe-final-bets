import { getJson, send } from './api'

const RES = '/clients'

export function findClientByEmail(email) {
  return getJson(`${RES}?email=${email}`)
}

export function findClientByCpf(cpf) {
  return getJson(`${RES}?cpf=${cpf}`)
}

export function loginClient(email, senha) {
  return getJson(`${RES}?email=${email}&senha=${senha}`)
}

export function getClients() {
  return getJson(RES)
}

export function getClient(id) {
  return getJson(`${RES}/${id}`)
}

export function createClient(data) {
  return send(RES, 'POST', data)
}

export function updateClient(id, patch) {
  return send(`${RES}/${id}`, 'PATCH', patch)
}
