import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import EventoCardCliente from '../components/EventoCardCliente'
import ApostaItem from '../components/ApostaItem'
import { getClient, updateClient } from '../services/clientsService'
import { getEvents, updateEvent } from '../services/eventsService'

const ERRO = 'Não foi possível conectar à API. Verifique se o servidor está rodando (npm run server).'

function ClienteDashboard() {
  const { user, login, logout } = useAuth()
  const navigate = useNavigate()

  const [cliente, setCliente]       = useState(user)
  const [eventos, setEventos]       = useState([])
  const [view, setView]             = useState('eventos')
  const [apostaAtual, setApostaAtual] = useState(null)
  const [modalSaldo, setModalSaldo] = useState(false)
  const [valorSaldo, setValorSaldo] = useState('')

  async function carregarCliente() {
    try {
      const dados = await getClient(user.id)
      setCliente(dados)
      login(dados)
    } catch { alert(ERRO) }
  }

  async function carregarEventos() {
    try {
      const dados = await getEvents()
      setEventos(dados)
    } catch { alert(ERRO) }
  }

  useEffect(() => {
    if (user) { carregarCliente(); carregarEventos() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const saldo = cliente?.saldo || 0

  async function confirmarSaldo(e) {
    e.preventDefault()
    const valor = Number(valorSaldo)
    if (!valor || valor <= 0) return
    try {
      await updateClient(user.id, { saldo: saldo + valor })
      setModalSaldo(false)
      setValorSaldo('')
      carregarCliente()
    } catch { alert(ERRO) }
  }

  function calcularOdd() {
    const min = 1.5
    const max = 5
    return Number((Math.random() * (max - min) + min).toFixed(2))
  }

  function handleEscolherVencedor(ev, vencedorId) {
    setApostaAtual({ eventoId: ev.id, vencedorId, odd: calcularOdd(), valor: '' })
  }

  async function handleConfirmarAposta(ev) {
    if ((ev.apostas || []).some(a => a.clientId === user.id)) { alert('Você já apostou neste evento'); return }
    const valor = Number(apostaAtual.valor)
    if (!valor || valor <= 0) { alert('Informe um valor válido'); return }
    if (valor > saldo)        { alert('Saldo insuficiente'); return }
    const novaAposta = { id: Date.now(), clientId: user.id, vencedorId: apostaAtual.vencedorId, odd: apostaAtual.odd, valor }
    try {
      await updateEvent(ev.id, { apostas: [...(ev.apostas || []), novaAposta] })
      await updateClient(user.id, { saldo: saldo - valor })
      setApostaAtual(null)
      carregarCliente()
      carregarEventos()
    } catch { alert(ERRO) }
  }

  function sair() { logout(); navigate('/') }

  const agora = new Date()
  const abertos = eventos.filter(ev =>
    !ev.fechado && !ev.resolvido &&
    new Date(ev.inicioApostas) <= agora &&
    agora < new Date(ev.dataHoraPartida)
  )

  const minhasApostas = []
  for (const ev of eventos)
    for (const ap of ev.apostas || [])
      if (ap.clientId === user.id)
        minhasApostas.push({ ...ap, evento: ev })

  const ganhas   = minhasApostas.filter(a => a.evento.resolvido && a.vencedorId === a.evento.resultado).length
  const perdidas = minhasApostas.filter(a => a.evento.resolvido && a.vencedorId !== a.evento.resultado).length

  return (
    <>
      <nav className="navbar navbar-expand bg-dark navbar-dark">
        <div className="container">
          <span className="navbar-brand">⚽ BetArena</span>
          <div className="navbar-nav me-auto">
            <Link to="/ranking" className="nav-link">🏆 Ranking</Link>
            <Link to="/profile" className="nav-link">👤 Meus dados</Link>
            <Link to="/regulamento" className="nav-link">📖 Regulamento</Link>
          </div>
          <button className="btn btn-outline-light btn-sm" onClick={sair}>← Sair</button>
        </div>
      </nav>

      <div className="container my-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
          <h1 className="h4 mb-0">Olá, {user.nome} 👋</h1>
          <div className="card">
            <div className="card-body py-2 d-flex align-items-center gap-3">
              <div>
                <div className="text-muted small">Saldo fictício</div>
                <strong className="fs-5">R$ {saldo.toFixed(2)}</strong>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => setModalSaldo(true)}>+ Adicionar saldo</button>
            </div>
          </div>
        </div>

        <div className="row row-cols-2 row-cols-md-4 g-3 mb-4">
          <div className="col">
            <div className="card text-center h-100"><div className="card-body">
              <div className="fs-3">🎯</div>
              <div className="fs-4 fw-bold">{abertos.length}</div>
              <div className="text-muted small">Eventos abertos</div>
            </div></div>
          </div>
          <div className="col">
            <div className="card text-center h-100"><div className="card-body">
              <div className="fs-3">📋</div>
              <div className="fs-4 fw-bold">{minhasApostas.length}</div>
              <div className="text-muted small">Total de apostas</div>
            </div></div>
          </div>
          <div className="col">
            <div className="card text-center h-100 border-success"><div className="card-body">
              <div className="fs-3">🏆</div>
              <div className="fs-4 fw-bold">{ganhas}</div>
              <div className="text-muted small">Apostas ganhas</div>
            </div></div>
          </div>
          <div className="col">
            <div className="card text-center h-100 border-danger"><div className="card-body">
              <div className="fs-3">❌</div>
              <div className="fs-4 fw-bold">{perdidas}</div>
              <div className="text-muted small">Apostas perdidas</div>
            </div></div>
          </div>
        </div>

        <ul className="nav nav-pills mb-3">
          <li className="nav-item">
            <button className={`nav-link ${view === 'eventos' ? 'active' : ''}`} onClick={() => setView('eventos')}>
              🎯 Eventos abertos {abertos.length > 0 && <span className="badge bg-light text-dark">{abertos.length}</span>}
            </button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${view === 'apostas' ? 'active' : ''}`} onClick={() => setView('apostas')}>
              📋 Minhas apostas {minhasApostas.length > 0 && <span className="badge bg-light text-dark">{minhasApostas.length}</span>}
            </button>
          </li>
        </ul>

        {view === 'eventos' && (
          abertos.length === 0 ? (
            <div className="text-center text-muted border rounded p-4">
              <div className="fs-1">📭</div>
              <p className="mb-0">Nenhum evento aberto no momento.</p>
              <p className="mb-0">Aguarde o administrador criar novos eventos.</p>
            </div>
          ) : (
            <div>
              {abertos.map(ev => (
                <EventoCardCliente
                  key={ev.id}
                  evento={ev}
                  apostaAtual={apostaAtual}
                  jaApostou={(ev.apostas || []).some(a => a.clientId === user.id)}
                  onEscolherVencedor={handleEscolherVencedor}
                  onConfirmarAposta={handleConfirmarAposta}
                  onCancelarAposta={() => setApostaAtual(null)}
                  onMudarValor={val => setApostaAtual({ ...apostaAtual, valor: val })}
                />
              ))}
            </div>
          )
        )}

        {view === 'apostas' && (
          minhasApostas.length === 0 ? (
            <div className="text-center text-muted border rounded p-4">
              <div className="fs-1">🎰</div>
              <p>Você ainda não fez nenhuma aposta.</p>
              <button className="btn btn-primary" onClick={() => setView('eventos')}>Ver eventos abertos</button>
            </div>
          ) : (
            <div>
              {minhasApostas.map(ap => <ApostaItem key={ap.id} aposta={ap} />)}
            </div>
          )
        )}
      </div>

      {modalSaldo && (
        <>
          <div className="modal d-block" tabIndex="-1" onClick={() => setModalSaldo(false)}>
            <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
              <div className="modal-content">
                <div className="modal-header">
                  <h2 className="modal-title h5">💰 Adicionar saldo fictício</h2>
                  <button type="button" className="btn-close" onClick={() => setModalSaldo(false)} />
                </div>
                <form onSubmit={confirmarSaldo}>
                  <div className="modal-body">
                    <p className="text-muted">Informe o valor que deseja adicionar à sua conta.</p>
                    <label className="form-label">Valor (R$)</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Ex: 100"
                      min="1"
                      step="1"
                      value={valorSaldo}
                      onChange={e => setValorSaldo(e.target.value)}
                      autoFocus
                      required
                    />
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setModalSaldo(false)}>Cancelar</button>
                    <button type="submit" className="btn btn-primary">Confirmar</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show" />
        </>
      )}
    </>
  )
}

export default ClienteDashboard
