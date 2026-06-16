import { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import clubes from '../data/clubes.json'

const API = 'http://localhost:3001/events'
const ERRO_CONEXAO =
  'Não foi possível conectar à API. Verifique se o servidor está rodando (npm run server).'

function AdminDashboard() {
  const location = useLocation()
  const user = location.state?.user

  const [eventos, setEventos] = useState([])
  const [clubeCasaId, setClubeCasaId] = useState('')
  const [clubeForaId, setClubeForaId] = useState('')
  const [dataHoraPartida, setDataHoraPartida] = useState('')
  const [inicioApostas, setInicioApostas] = useState('')
  const [editandoId, setEditandoId] = useState(null)

  async function carregarEventos() {
    try {
      const resposta = await fetch(`${API}?adminId=${user.id}`)
      const dados = await resposta.json()
      setEventos(dados)
    } catch {
      alert(ERRO_CONEXAO)
    }
  }

  useEffect(() => {
    if (user) carregarEventos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function limparFormulario() {
    setClubeCasaId('')
    setClubeForaId('')
    setDataHoraPartida('')
    setInicioApostas('')
    setEditandoId(null)
  }

  async function salvar(e) {
    e.preventDefault()
    if (clubeCasaId === clubeForaId) {
      alert('Selecione dois clubes diferentes')
      return
    }
    try {
      if (editandoId === null) {
        // criar
        await fetch(API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            adminId: user.id,
            clubeCasaId: Number(clubeCasaId),
            clubeForaId: Number(clubeForaId),
            dataHoraPartida,
            inicioApostas,
            apostas: [],
          }),
        })
      } else {
        // editar (não mexe na lista de apostas)
        await fetch(`${API}/${editandoId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clubeCasaId: Number(clubeCasaId),
            clubeForaId: Number(clubeForaId),
            dataHoraPartida,
            inicioApostas,
          }),
        })
      }
      limparFormulario()
      carregarEventos()
    } catch {
      alert(ERRO_CONEXAO)
    }
  }

  function editar(ev) {
    setClubeCasaId(String(ev.clubeCasaId))
    setClubeForaId(String(ev.clubeForaId))
    setDataHoraPartida(ev.dataHoraPartida)
    setInicioApostas(ev.inicioApostas)
    setEditandoId(ev.id)
  }

  async function excluir(id) {
    try {
      await fetch(`${API}/${id}`, { method: 'DELETE' })
      carregarEventos()
    } catch {
      alert(ERRO_CONEXAO)
    }
  }

  function nomeClube(id) {
    const clube = clubes.find((c) => c.id === Number(id))
    return clube ? clube.nome : '?'
  }

  function formatarData(valor) {
    return new Date(valor).toLocaleString('pt-BR')
  }

  if (!user) {
    return (
      <div className="page">
        <p>Nenhum administrador logado.</p>
        <Link to="/admin/login">Ir para o login</Link>
      </div>
    )
  }

  return (
    <div className="page">
      <h1>Gerenciar Eventos</h1>
      <p>Admin: {user.nome}</p>

      <form onSubmit={salvar} className="formulario">
        <select
          value={clubeCasaId}
          onChange={(e) => setClubeCasaId(e.target.value)}
          required
        >
          <option value="">Time da casa</option>
          {clubes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>

        <select
          value={clubeForaId}
          onChange={(e) => setClubeForaId(e.target.value)}
          required
        >
          <option value="">Time visitante</option>
          {clubes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>

        <label>Data e hora da partida</label>
        <input
          type="datetime-local"
          value={dataHoraPartida}
          onChange={(e) => setDataHoraPartida(e.target.value)}
          required
        />

        <label>Abertura das apostas</label>
        <input
          type="datetime-local"
          value={inicioApostas}
          onChange={(e) => setInicioApostas(e.target.value)}
          required
        />

        <button type="submit">{editandoId === null ? 'Criar evento' : 'Atualizar'}</button>
        {editandoId !== null && (
          <button type="button" onClick={limparFormulario}>
            Cancelar
          </button>
        )}
      </form>

      <h2>Meus eventos</h2>
      {eventos.length === 0 ? (
        <p>Nenhum evento cadastrado.</p>
      ) : (
        <ul className="lista-eventos">
          {eventos.map((ev) => (
            <li key={ev.id}>
              <strong>
                {nomeClube(ev.clubeCasaId)} x {nomeClube(ev.clubeForaId)}
              </strong>
              <p>Partida: {formatarData(ev.dataHoraPartida)}</p>
              <p>Apostas abrem: {formatarData(ev.inicioApostas)}</p>
              <p>Apostas: {ev.apostas.length}</p>
              <button onClick={() => editar(ev)}>Editar</button>
              <button onClick={() => excluir(ev.id)}>Excluir</button>
            </li>
          ))}
        </ul>
      )}

      <Link to="/">Sair</Link>
    </div>
  )
}

export default AdminDashboard
