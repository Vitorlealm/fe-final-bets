import { getJson, send } from './api'

const RES = '/admins'

export function findAdminByEmail(email) {
  return getJson(`${RES}?email=${email}`)
}

export function findAdminByCpf(cpf) {
  return getJson(`${RES}?cpf=${cpf}`)
}

export function loginAdmin(email, senha) {
  return getJson(`${RES}?email=${email}&senha=${senha}`)
}

export function createAdmin(data) {
  return send(RES, 'POST', data)
}
