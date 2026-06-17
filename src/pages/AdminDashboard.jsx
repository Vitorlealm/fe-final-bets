import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import EventoCardAdmin from '../components/EventoCardAdmin'
import clubes from '../data/clubes.json'

const API     = 'http://localhost:3001/events'
const CLIENTS = 'http://localhost:3001/clients'
const ERRO    = 'Não foi possível conectar à API. Verifique se o servidor está rodando (npm run server).'

function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [eventos, setEventos]               = useState([])
  const [clubeCasaId, setClubeCasaId]       = useState('')
  const [clubeForaId, setClubeForaId]       = useState('')
  const [dataHoraPartida, setDataHoraPartida] = useState('')
  const [inicioApostas, setInicioApostas]   = useState('')
  const [editandoId, setEditandoId]         = useState(null)
  const [view, setView]                     = useState('eventos')

  async function carregarEventos() {
    try {
      const resposta = await fetch(`${API}?adminId=${user.id}`)
      const dados = await resposta.json()
      setEventos(dados)
    } catch { alert(ERRO) }
  }

  useEffect(() => {
    if (user) carregarEventos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function limparFormulario() {
    setClubeCasaId(''); setClubeForaId('')
    setDataHoraPartida(''); setInicioApostas('')
    setEditandoId(null)
  }

  async function salvar(e) {
    e.preventDefault()
    if (clubeCasaId === clubeForaId) { alert('Selecione dois clubes diferentes'); return }
    try {
      if (editandoId === null) {
        await fetch(API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            adminId: user.id,
            clubeCasaId: Number(clubeCasaId), clubeForaId: Number(clubeForaId),
            dataHoraPartida, inicioApostas, apostas: [], fechado: false,
          }),
        })
      } else {
        await fetch(`${API}/${editandoId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clubeCasaId: Number(clubeCasaId), clubeForaId: Number(clubeForaId), dataHoraPartida, inicioApostas }),
        })
      }
      limparFormulario()
      setView('eventos')
      carregarEventos()
    } catch { alert(ERRO) }
  }

  function handleEditar(ev) {
    setClubeCasaId(String(ev.clubeCasaId)); setClubeForaId(String(ev.clubeForaId))
    setDataHoraPartida(ev.dataHoraPartida); setInicioApostas(ev.inicioApostas)
    setEditandoId(ev.id)
    setView('novo')
  }

  async function handleExcluir(id) {
    try { await fetch(`${API}/${id}`, { method: 'DELETE' }); carregarEventos() }
    catch { alert(ERRO) }
  }

  async function handleFechar(ev) {
    try {
      await fetch(`${API}/${ev.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fechado: true }) })
      carregarEventos()
    } catch { alert(ERRO) }
  }

  async function handleGerarResultado(ev) {
    const vencedorId = Math.random() < 0.5 ? ev.clubeCasaId : ev.clubeForaId
    try {
      for (const ap of ev.apostas || []) {
        if (ap.vencedorId === vencedorId) {
          const cli = await (await fetch(`${CLIENTS}/${ap.clientId}`)).json()
          await fetch(`${CLIENTS}/${ap.clientId}`, {
            method: 'PATCH', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ saldo: (cli.saldo || 0) + (ap.valor || 0) * ap.odd }),
          })
        }
      }
      await fetch(`${API}/${ev.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolvido: true, resultado: vencedorId }),
      })
      alert('Resultado gerado! Vencedor: ' + (clubes.find(c => c.id === vencedorId)?.nome || '?'))
      carregarEventos()
    } catch { alert(ERRO) }
  }

  function sair() { logout(); navigate('/') }

  // Estatísticas rápidas
  const totalApostas  = eventos.reduce((acc, ev) => acc + (ev.apostas || []).length, 0)
  const abertos       = eventos.filter(ev => !ev.fechado && !ev.resolvido).length
  const resolvidos    = eventos.filter(ev => ev.resolvido).length

  return (
    <div className="dash-page">
      {/* ── Sidebar ── */}
      <aside className="dash-sidebar dash-sidebar--admin">
        <div className="dash-sidebar-logo">
          <span>🛡️</span>
          <strong>BetArena</strong>
        </div>

        <div className="dash-admin-info">
          <span className="dash-admin-avatar">👤</span>
          <div>
            <strong>{user.nome}</strong>
            <span>Administrador</span>
          </div>
        </div>

        <nav className="dash-nav">
          <button
            className={`dash-nav-item ${view === 'eventos' ? 'dash-nav-item--ativo' : ''}`}
            onClick={() => setView('eventos')}
          >
            📋 Meus eventos
            {eventos.length > 0 && <span className="dash-badge">{eventos.length}</span>}
          </button>
          <button
            className={`dash-nav-item ${view === 'novo' ? 'dash-nav-item--ativo' : ''}`}
            onClick={() => { limparFormulario(); setView('novo') }}
          >
            ➕ Novo evento
          </button>
          <Link to="/ranking"     className="dash-nav-item">🏆 Ranking</Link>
          <Link to="/regulamento" className="dash-nav-item">📖 Regulamento</Link>
        </nav>

        <button className="dash-sair" onClick={sair}>← Sair</button>
      </aside>

      {/* ── Conteúdo ── */}
      <main className="dash-main">
        {/* Cards de resumo */}
        <div className="dash-resumo">
          <div className="dash-resumo-card">
            <span className="dash-resumo-icon">📋</span>
            <div>
              <span className="dash-resumo-num">{eventos.length}</span>
              <span className="dash-resumo-label">Total de eventos</span>
            </div>
          </div>
          <div className="dash-resumo-card dash-resumo-card--aberto">
            <span className="dash-resumo-icon">🟢</span>
            <div>
              <span className="dash-resumo-num">{abertos}</span>
              <span className="dash-resumo-label">Eventos abertos</span>
            </div>
          </div>
          <div className="dash-resumo-card">
            <span className="dash-resumo-icon">✅</span>
            <div>
              <span className="dash-resumo-num">{resolvidos}</span>
              <span className="dash-resumo-label">Resolvidos</span>
            </div>
          </div>
          <div className="dash-resumo-card">
            <span className="dash-resumo-icon">🎰</span>
            <div>
              <span className="dash-resumo-num">{totalApostas}</span>
              <span className="dash-resumo-label">Apostas recebidas</span>
            </div>
          </div>
        </div>

        {/* ── Formulário novo/editar evento ── */}
        {view === 'novo' && (
          <div className="dash-form-panel">
            <div className="dash-secao-header">
              <h2>{editandoId === null ? '➕ Novo Evento' : '✏️ Editar Evento'}</h2>
            </div>

            <form onSubmit={salvar} className="dash-form">
              <div className="dash-form-linha">
                <div className="form-group">
                  <label>Time da casa</label>
                  <select value={clubeCasaId} onChange={e => setClubeCasaId(e.target.value)} required>
                    <option value="">Selecione...</option>
                    {clubes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                  </select>
                </div>
                <div className="dash-vs">VS</div>
                <div className="form-group">
                  <label>Time visitante</label>
                  <select value={clubeForaId} onChange={e => setClubeForaId(e.target.value)} required>
                    <option value="">Selecione...</option>
                    {clubes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                  </select>
                </div>
              </div>

              <div className="dash-form-linha">
                <div className="form-group">
                  <label>📅 Data e hora da partida</label>
                  <input type="datetime-local" value={dataHoraPartida} onChange={e => setDataHoraPartida(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>🔓 Abertura das apostas</label>
                  <input type="datetime-local" value={inicioApostas} onChange={e => setInicioApostas(e.target.value)} required />
                </div>
              </div>

              <div className="dash-form-acoes">
                <button type="submit" className="btn-primary btn-admin">
                  {editandoId === null ? '✅ Criar evento' : '💾 Salvar alterações'}
                </button>
                {editandoId !== null && (
                  <button type="button" className="btn-secondary" onClick={() => { limparFormulario(); setView('eventos') }}>
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* ── Lista de eventos ── */}
        {view === 'eventos' && (
          <>
            <div className="dash-secao-header">
              <h2>📋 Meus Eventos</h2>
              <button className="btn-primary btn-admin btn-sm" onClick={() => { limparFormulario(); setView('novo') }}>
                + Novo evento
              </button>
            </div>

            {eventos.length === 0
              ? <div className="dash-vazio">
                  <span>📭</span>
                  <p>Nenhum evento criado ainda.</p>
                  <button className="btn-primary btn-admin" onClick={() => setView('novo')}>Criar primeiro evento</button>
                </div>
              : <ul className="lista-eventos">
                  {eventos.map(ev => (
                    <EventoCardAdmin
                      key={ev.id}
                      evento={ev}
                      onEditar={handleEditar}
                      onExcluir={handleExcluir}
                      onFechar={handleFechar}
                      onGerarResultado={handleGerarResultado}
                    />
                  ))}
                </ul>
            }
          </>
        )}
      </main>
    </div>
  )
}

export default AdminDashboard
