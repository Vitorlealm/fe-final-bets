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
    return Number((Math.random() * (5 - 1.5) + 1.5).toFixed(2))
  }

  function handleEscolherVencedor(ev, vencedorId) {
    setApostaAtual({ eventoId: ev.id, vencedorId, odd: calcularOdd(), valor: '' })
  }

  async function handleConfirmarAposta(ev) {
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
    <div className="dash-page">
      {/* ── Sidebar ── */}
      <aside className="dash-sidebar dash-sidebar--cliente">
        <div className="dash-sidebar-logo">
          <span>⚽</span>
          <strong>BetArena</strong>
        </div>

        <div className="dash-saldo-card">
          <span className="dash-saldo-label">Saldo fictício</span>
          <span className="dash-saldo-valor">R$ {saldo.toFixed(2)}</span>
          <button className="btn-primary btn-full" onClick={() => setModalSaldo(true)}>
            + Adicionar saldo
          </button>
        </div>

        <nav className="dash-nav">
          <button
            className={`dash-nav-item ${view === 'eventos' ? 'dash-nav-item--ativo' : ''}`}
            onClick={() => setView('eventos')}
          >
            🎯 Eventos abertos
            {abertos.length > 0 && <span className="dash-badge">{abertos.length}</span>}
          </button>
          <button
            className={`dash-nav-item ${view === 'apostas' ? 'dash-nav-item--ativo' : ''}`}
            onClick={() => setView('apostas')}
          >
            📋 Minhas apostas
            {minhasApostas.length > 0 && <span className="dash-badge">{minhasApostas.length}</span>}
          </button>
          <Link to="/ranking"    className="dash-nav-item">🏆 Ranking</Link>
          <Link to="/profile"    className="dash-nav-item">👤 Meus dados</Link>
          <Link to="/regulamento" className="dash-nav-item">📖 Regulamento</Link>
        </nav>

        <button className="dash-sair" onClick={sair}>← Sair</button>
      </aside>

      {/* ── Conteúdo principal ── */}
      <main className="dash-main">
        {/* Cards de resumo */}
        <div className="dash-resumo">
          <div className="dash-resumo-card">
            <span className="dash-resumo-icon">🎯</span>
            <div>
              <span className="dash-resumo-num">{abertos.length}</span>
              <span className="dash-resumo-label">Eventos abertos</span>
            </div>
          </div>
          <div className="dash-resumo-card">
            <span className="dash-resumo-icon">📋</span>
            <div>
              <span className="dash-resumo-num">{minhasApostas.length}</span>
              <span className="dash-resumo-label">Total de apostas</span>
            </div>
          </div>
          <div className="dash-resumo-card dash-resumo-card--ganhou">
            <span className="dash-resumo-icon">🏆</span>
            <div>
              <span className="dash-resumo-num">{ganhas}</span>
              <span className="dash-resumo-label">Apostas ganhas</span>
            </div>
          </div>
          <div className="dash-resumo-card dash-resumo-card--perdeu">
            <span className="dash-resumo-icon">❌</span>
            <div>
              <span className="dash-resumo-num">{perdidas}</span>
              <span className="dash-resumo-label">Apostas perdidas</span>
            </div>
          </div>
        </div>

        {/* Título da seção */}
        <div className="dash-secao-header">
          <h2>{view === 'eventos' ? '🎯 Eventos abertos' : '📋 Minhas apostas'}</h2>
          <span className="dash-secao-sub">
            Olá, <strong>{user.nome}</strong>
          </span>
        </div>

        {/* Eventos */}
        {view === 'eventos' && (
          abertos.length === 0
            ? <div className="dash-vazio"><span>📭</span><p>Nenhum evento aberto no momento.</p><p>Aguarde o administrador criar novos eventos.</p></div>
            : <ul className="lista-eventos">
                {abertos.map(ev => (
                  <EventoCardCliente
                    key={ev.id}
                    evento={ev}
                    apostaAtual={apostaAtual}
                    onEscolherVencedor={handleEscolherVencedor}
                    onConfirmarAposta={handleConfirmarAposta}
                    onCancelarAposta={() => setApostaAtual(null)}
                    onMudarValor={val => setApostaAtual({ ...apostaAtual, valor: val })}
                  />
                ))}
              </ul>
        )}

        {/* Apostas */}
        {view === 'apostas' && (
          minhasApostas.length === 0
            ? <div className="dash-vazio"><span>🎰</span><p>Você ainda não fez nenhuma aposta.</p><button className="btn-primary" onClick={() => setView('eventos')}>Ver eventos abertos</button></div>
            : <ul className="lista-eventos">
                {minhasApostas.map(ap => <ApostaItem key={ap.id} aposta={ap} />)}
              </ul>
        )}
      </main>

      {/* ── Modal adicionar saldo ── */}
      {modalSaldo && (
        <div className="modal-overlay" onClick={() => setModalSaldo(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>💰 Adicionar saldo fictício</h2>
            <p>Informe o valor que deseja adicionar à sua conta.</p>
            <form onSubmit={confirmarSaldo} className="modal-form">
              <div className="form-group">
                <label>Valor (R$)</label>
                <input
                  type="number"
                  placeholder="Ex: 100"
                  min="1"
                  step="1"
                  value={valorSaldo}
                  onChange={e => setValorSaldo(e.target.value)}
                  autoFocus
                  required
                />
              </div>
              <div className="modal-acoes">
                <button type="submit" className="btn-primary">Confirmar</button>
                <button type="button" className="btn-secondary" onClick={() => setModalSaldo(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClienteDashboard
