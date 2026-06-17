import clubes from '../data/clubes.json'

// Devolve o nome do clube a partir do id (ou '?' se não encontrar).
export function nomeClube(id) {
  const clube = clubes.find((c) => c.id === Number(id))
  return clube ? clube.nome : '?'
}

// Formata uma data ISO no padrão brasileiro (dd/mm/aaaa hh:mm).
export function formatarData(valor) {
  return new Date(valor).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}
