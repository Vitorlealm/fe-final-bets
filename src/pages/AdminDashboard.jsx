import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import EventoCardAdmin from '../components/EventoCardAdmin'
import clubes from '../data/clubes.json'
import { getClient, updateClient } from '../services/clientsService'
import { getEventsByAdmin, createEvent, updateEvent, deleteEvent } from '../services/eventsService'

const ERRO = 'Não foi possível conectar à API. Verifique se o servidor está rodando (npm run server).'

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
      const dados = await getEventsByAdmin(user.id)
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
        await createEvent({
          adminId: user.id,
          clubeCasaId: Number(clubeCasaId), clubeForaId: Number(clubeForaId),
          dataHoraPartida, inicioApostas, apostas: [], fechado: false,
        })
      } else {
        await updateEvent(editandoId, { clubeCasaId: Number(clubeCasaId), clubeForaId: Number(clubeForaId), dataHoraPartida, inicioApostas })
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
    try { await deleteEvent(id); carregarEventos() }
    catch { alert(ERRO) }
  }

  async function handleFechar(ev) {
    try {
      await updateEvent(ev.id, { fechado: true })
      carregarEventos()
    } catch { alert(ERRO) }
  }

  async function handleGerarResultado(ev) {
    const vencedorId = Math.random() < 0.5 ? ev.clubeCasaId : ev.clubeForaId
    try {
      for (const ap of ev.apostas || []) {
        if (ap.vencedorId === vencedorId) {
          const cli = await getClient(ap.clientId)
          await updateClient(ap.clientId, { saldo: (cli.saldo || 0) + (ap.valor || 0) * ap.odd })
        }
      }
      await updateEvent(ev.id, { resolvido: true, resultado: vencedorId })
      alert('Resultado gerado! Vencedor: ' + (clubes.find(c => c.id === vencedorId)?.nome || '?'))
      carregarEventos()
    } catch { alert(ERRO) }
  }

  function sair() { logout(); navigate('/') }

  const totalApostas  = eventos.reduce((acc, ev) => acc + (ev.apostas || []).length, 0)
  const abertos       = eventos.filter(ev => !ev.fechado && !ev.resolvido).length
  const resolvidos    = eventos.filter(ev => ev.resolvido).length

  return (
    <>
      <nav className="navbar navbar-expand bg-warning">
        <div className="container">
          <span className="navbar-brand">🛡️ BetArena Admin</span>
          <div className="navbar-nav me-auto">
            <Link to="/ranking" className="nav-link">🏆 Ranking</Link>
            <Link to="/regulamento" className="nav-link">📖 Regulamento</Link>
          </div>
          <button className="btn btn-outline-dark btn-sm" onClick={sair}>← Sair</button>
        </div>
      </nav>

      <div className="container my-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
          <h1 className="h4 mb-0">Olá, {user.nome}</h1>
          <span className="badge bg-warning text-dark fs-6">🛡️ Administrador</span>
        </div>

        <div className="row row-cols-2 row-cols-md-4 g-3 mb-4">
          <div className="col"><div className="card text-center h-100"><div className="card-body">
            <div className="fs-3">📋</div><div className="fs-4 fw-bold">{eventos.length}</div><div className="text-muted small">Total de eventos</div>
          </div></div></div>
          <div className="col"><div className="card text-center h-100 border-success"><div className="card-body">
            <div className="fs-3">🟢</div><div className="fs-4 fw-bold">{abertos}</div><div className="text-muted small">Eventos abertos</div>
          </div></div></div>
          <div className="col"><div className="card text-center h-100"><div className="card-body">
            <div className="fs-3">✅</div><div className="fs-4 fw-bold">{resolvidos}</div><div className="text-muted small">Resolvidos</div>
          </div></div></div>
          <div className="col"><div className="card text-center h-100"><div className="card-body">
            <div className="fs-3">🎰</div><div className="fs-4 fw-bold">{totalApostas}</div><div className="text-muted small">Apostas recebidas</div>
          </div></div></div>
        </div>

        <ul className="nav nav-pills mb-3">
          <li className="nav-item">
            <button className={`nav-link ${view === 'eventos' ? 'active' : ''}`} onClick={() => setView('eventos')}>
              📋 Meus eventos {eventos.length > 0 && <span className="badge bg-light text-dark">{eventos.length}</span>}
            </button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${view === 'novo' ? 'active' : ''}`} onClick={() => { limparFormulario(); setView('novo') }}>
              ➕ Novo evento
            </button>
          </li>
        </ul>

        {view === 'novo' && (
          <div className="card mb-4">
            <div className="card-body">
              <h2 className="h5 mb-3">{editandoId === null ? '➕ Novo Evento' : '✏️ Editar Evento'}</h2>
              <form onSubmit={salvar}>
                <div className="row">
                  <div className="col-md-5 mb-3">
                    <label className="form-label">Time da casa</label>
                    <select className="form-select" value={clubeCasaId} onChange={e => setClubeCasaId(e.target.value)} required>
                      <option value="">Selecione...</option>
                      {clubes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                    </select>
                  </div>
                  <div className="col-md-2 d-flex align-items-end justify-content-center mb-3">
                    <span className="fw-bold">VS</span>
                  </div>
                  <div className="col-md-5 mb-3">
                    <label className="form-label">Time visitante</label>
                    <select className="form-select" value={clubeForaId} onChange={e => setClubeForaId(e.target.value)} required>
                      <option value="">Selecione...</option>
                      {clubes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                    </select>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">📅 Data e hora da partida</label>
                    <input type="datetime-local" className="form-control" value={dataHoraPartida} onChange={e => setDataHoraPartida(e.target.value)} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">🔓 Abertura das apostas</label>
                    <input type="datetime-local" className="form-control" value={inicioApostas} onChange={e => setInicioApostas(e.target.value)} required />
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-warning">
                    {editandoId === null ? '✅ Criar evento' : '💾 Salvar alterações'}
                  </button>
                  {editandoId !== null && (
                    <button type="button" className="btn btn-outline-secondary" onClick={() => { limparFormulario(); setView('eventos') }}>
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        {view === 'eventos' && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h5 mb-0">📋 Meus Eventos</h2>
              <button className="btn btn-warning btn-sm" onClick={() => { limparFormulario(); setView('novo') }}>
                + Novo evento
              </button>
            </div>

            {eventos.length === 0 ? (
              <div className="text-center text-muted border rounded p-4">
                <div className="fs-1">📭</div>
                <p>Nenhum evento criado ainda.</p>
                <button className="btn btn-warning" onClick={() => setView('novo')}>Criar primeiro evento</button>
              </div>
            ) : (
              <div>
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
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default AdminDashboard
