import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getClients } from '../services/clientsService'
import { getEvents } from '../services/eventsService'

const ERRO_CONEXAO =
  'Não foi possível conectar à API. Verifique se o servidor está rodando (npm run server).'

const PREMIACOES = [
  { posicao: 1, medalha: '🥇', titulo: 'Campeão das Apostas', bonus: 500 },
  { posicao: 2, medalha: '🥈', titulo: 'Vice-Campeão', bonus: 250 },
  { posicao: 3, medalha: '🥉', titulo: 'Terceiro Lugar', bonus: 100 },
]

function Ranking() {
  const { user } = useAuth()
  const [ranking, setRanking] = useState([])
  const [carregando, setCarregando] = useState(true)

  async function carregarRanking() {
    try {
      setCarregando(true)
      const [clientes, eventos] = await Promise.all([getClients(), getEvents()])

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

  useEffect(() => {
    carregarRanking()
  }, [])

  function getPremiacao(posicao) {
    return PREMIACOES.find((p) => p.posicao === posicao) || null
  }

  function getTaxaAcerto(apostas, acertos) {
    if (apostas === 0) return '0%'
    return ((acertos / apostas) * 100).toFixed(0) + '%'
  }

  const podio = ranking.slice(0, 3)

  return (
    <div className="container my-4">
      <h1 className="h3">🏆 Ranking de Jogadores</h1>
      <p className="text-muted">
        Classificação baseada no total de prêmios acumulados em apostas resolvidas.
      </p>

      {carregando ? (
        <p>Carregando ranking...</p>
      ) : ranking.length === 0 ? (
        <p>Nenhuma aposta resolvida ainda. O ranking será atualizado após os primeiros resultados.</p>
      ) : (
        <>
          {podio.length > 0 && (
            <section className="mb-4">
              <h2 className="h5">Pódio</h2>
              <div className="row g-3">
                {podio.map((jogador, i) => {
                  const premiacao = getPremiacao(i + 1)
                  const isUsuarioAtual = user && jogador.id === user.id
                  return (
                    <div className="col-12 col-md-4" key={jogador.id}>
                      <div className={`card text-center h-100 ${isUsuarioAtual ? 'border-primary border-2' : ''}`}>
                        <div className="card-body">
                          <div className="fs-1">{premiacao.medalha}</div>
                          <h3 className="h6 mb-1">
                            {jogador.nome}
                            {isUsuarioAtual && ' (você)'}
                          </h3>
                          <p className="text-muted mb-1">{premiacao.titulo}</p>
                          <p className="fw-bold mb-1">R$ {jogador.ganhos.toFixed(2)} em prêmios</p>
                          <p className="text-success small mb-1">🎁 Bônus fictício: R$ {premiacao.bonus.toFixed(2)}</p>
                          <p className="text-muted small mb-0">
                            {jogador.acertos}/{jogador.apostas} acertos ({getTaxaAcerto(jogador.apostas, jogador.acertos)})
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          <section>
            <h2 className="h5">Classificação Geral</h2>
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle">
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
                    const premiacao = getPremiacao(i + 1)
                    const isUsuarioAtual = user && jogador.id === user.id
                    return (
                      <tr key={jogador.id} className={isUsuarioAtual ? 'table-primary' : ''}>
                        <td>{premiacao ? premiacao.medalha : `${i + 1}º`}</td>
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
            </div>
            <p className="text-muted small">
              * Os bônus são fictícios e têm finalidade exclusivamente acadêmica.
            </p>
          </section>
        </>
      )}

      {user?.perfil === 'cliente' && <Link to="/cliente/dashboard">← Voltar ao dashboard</Link>}
      {user?.perfil === 'administrador' && <Link to="/admin/dashboard">← Voltar ao dashboard</Link>}
    </div>
  )
}

export default Ranking
