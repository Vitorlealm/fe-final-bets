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

// O corpo (data) vem inteiro do chamador para preservar o discriminador de cada tela
// (AdminLogin envia `perfil: 'administrador'`, AdminCadastro envia `tipo: 'administrador'`).
export function createAdmin(data) {
  return send(RES, 'POST', data)
}
