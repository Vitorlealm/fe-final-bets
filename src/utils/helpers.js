import clubes from '../data/clubes.json'

export function nomeClube(id) {
  const clube = clubes.find((c) => c.id === Number(id))
  return clube ? clube.nome : '?'
}

export function formatarData(valor) {
  return new Date(valor).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}
