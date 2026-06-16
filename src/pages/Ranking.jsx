import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const CLIENTS = 'http://localhost:3001/clients'
const EVENTS = 'http://localhost:3001/events'
const ERRO_CONEXAO =
  'Não foi possível conectar à API. Verifique se o servidor está rodando (npm run server).'

// Medalhas e títulos para o pódio
const PREMIACOES = [
  { posicao: 1, medalha: '🥇', titulo: 'Campeão das Apostas', bonus: 500 },
  { posicao: 2, medalha: '🥈', titulo: 'Vice-Campeão', bonus: 250 },
  { posicao: 3, medalha: '🥉', titulo: 'Terceiro Lugar', bonus: 100 },
]

function Ranking() {
  const { user } = useAuth()
  const [ranking, setRanking] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    carregarRanking()
  }, [])

  async function carregarRanking() {
    try {
      setCarregando(true)
      const [clientes, eventos] = await Promise.all([
        fetch(CLIENTS).then((r) => r.json()),
        fetch(EVENTS).then((r) => r.json()),
      ])

      // Calcula total ganho por cliente varrendo apostas resolvidas
      const ganhosPorCliente = {}
      for (const ev of eventos) {
        if (!ev.resolvido) continue
        for (const ap of ev.apostas || []) {
          if (!ganhosPorCliente[ap.clientId]) {
            ganhosPorCliente[ap.clientId] = { ganhos: 0, apostas: 0, acertos: 0 }
          }
          ganhosPorCliente[ap.clientId].apostas += 1
          if (ap.vencedorId === ev.resultado) {
            const premio = (ap.valor || 0) * ap.odd
            ganhosPorCliente[ap.clientId].ganhos += premio
            ganhosPorCliente[ap.clientId].acertos += 1
          }
        }
      }

      // Monta lista ordenada por ganhos
      const lista = clientes
        .map((c) => ({
          id: c.id,
          nome: c.nome,
          saldo: c.saldo || 0,
          ganhos: ganhosPorCliente[c.id]?.ganhos || 0,
          apostas: ganhosPorCliente[c.id]?.apostas || 0,
          acertos: ganhosPorCliente[c.id]?.acertos || 0,
        }))
        .sort((a, b) => b.ganhos - a.ganhos)

      setRanking(lista)
    } catch {
      alert(ERRO_CONEXAO)
    } finally {
      setCarregando(false)
    }
  }

  function getPremiacão(posicao) {
    return PREMIACOES.find((p) => p.posicao === posicao) || null
  }

  function getTaxaAcerto(apostas, acertos) {
    if (apostas === 0) return '0%'
    return ((acertos / apostas) * 100).toFixed(0) + '%'
  }

  const podio = ranking.slice(0, 3)
  const demais = ranking.slice(3)

  return (
    <div className="page">
      <h1>🏆 Ranking de Jogadores</h1>
      <p className="ranking-subtitulo">
        Classificação baseada no total de prêmios acumulados em apostas resolvidas.
      </p>

      {carregando ? (
        <p>Carregando ranking...</p>
      ) : ranking.length === 0 ? (
        <p>Nenhuma aposta resolvida ainda. O ranking será atualizado após os primeiros resultados.</p>
      ) : (
        <>
          {/* Pódio */}
          {podio.length > 0 && (
            <section className="podio">
              <h2>Pódio</h2>
              <div className="podio-cards">
                {podio.map((jogador, i) => {
                  const premiacao = getPremiacão(i + 1)
                  const isUsuarioAtual = user && jogador.id === user.id
                  return (
                    <div
                      key={jogador.id}
                      className={`podio-card podio-${i + 1}${isUsuarioAtual ? ' podio-card--voce' : ''}`}
                    >
                      <span className="podio-medalha">{premiacao.medalha}</span>
                      <strong className="podio-nome">
                        {jogador.nome}
                        {isUsuarioAtual && ' (você)'}
                      </strong>
                      <p className="podio-titulo">{premiacao.titulo}</p>
                      <p className="podio-ganhos">
                        R$ {jogador.ganhos.toFixed(2)} em prêmios
                      </p>
                      <p className="podio-bonus">
                        🎁 Bônus fictício: R$ {premiacao.bonus.toFixed(2)}
                      </p>
                      <p className="podio-stats">
                        {jogador.acertos}/{jogador.apostas} acertos (
                        {getTaxaAcerto(jogador.apostas, jogador.acertos)})
                      </p>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Tabela completa */}
          <section className="ranking-tabela-section">
            <h2>Classificação Geral</h2>
            <table className="ranking-tabela">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Jogador</th>
                  <th>Total ganho</th>
                  <th>Apostas</th>
                  <th>Acertos</th>
                  <th>Taxa</th>
                  <th>Saldo atual</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((jogador, i) => {
                  const premiacao = getPremiacão(i + 1)
                  const isUsuarioAtual = user && jogador.id === user.id
                  return (
                    <tr
                      key={jogador.id}
                      className={isUsuarioAtual ? 'ranking-linha--voce' : ''}
                    >
                      <td>
                        {premiacao ? premiacao.medalha : `${i + 1}º`}
                      </td>
                      <td>
                        {jogador.nome}
                        {isUsuarioAtual && ' ⭐'}
                      </td>
                      <td>R$ {jogador.ganhos.toFixed(2)}</td>
                      <td>{jogador.apostas}</td>
                      <td>{jogador.acertos}</td>
                      <td>{getTaxaAcerto(jogador.apostas, jogador.acertos)}</td>
                      <td>R$ {jogador.saldo.toFixed(2)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </section>

          <p className="ranking-aviso">
            * Os bônus são fictícios e têm finalidade exclusivamente acadêmica.
          </p>
        </>
      )}

      {user?.perfil === 'cliente' && (
        <Link to="/cliente/dashboard">Voltar ao dashboard</Link>
      )}
      {user?.perfil === 'administrador' && (
        <Link to="/admin/dashboard">Voltar ao dashboard</Link>
      )}
    </div>
  )
}

export default Ranking
