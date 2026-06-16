import { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import clubes from '../data/clubes.json'

const EVENTS = 'http://localhost:3001/events'
const CLIENTS = 'http://localhost:3001/clients'
const ERRO_CONEXAO =
  'Não foi possível conectar à API. Verifique se o servidor está rodando (npm run server).'

function ClienteDashboard() {
  const location = useLocation()
  const user = location.state?.user

  const [cliente, setCliente] = useState(user)
  const [eventos, setEventos] = useState([])
  const [view, setView] = useState('eventos')
  const [apostaAtual, setApostaAtual] = useState(null)

  async function carregarCliente() {
    try {
      const dados = await (await fetch(`${CLIENTS}/${user.id}`)).json()
      setCliente(dados)
    } catch {
      alert(ERRO_CONEXAO)
    }
  }

  async function carregarEventos() {
    try {
      const dados = await (await fetch(EVENTS)).json()
      setEventos(dados)
    } catch {
      alert(ERRO_CONEXAO)
    }
  }

  useEffect(() => {
    if (user) {
      carregarCliente()
      carregarEventos()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const saldo = cliente?.saldo || 0

  async function adicionarSaldo() {
    const valor = Number(prompt('Quanto deseja adicionar ao saldo?'))
    if (!valor || valor <= 0) return
    try {
      await fetch(`${CLIENTS}/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ saldo: saldo + valor }),
      })
      carregarCliente()
    } catch {
      alert(ERRO_CONEXAO)
    }
  }

  // odd aleatória entre 1.50 e 5.00 com 2 casas decimais
  function calcularOdd() {
    return Number((Math.random() * (5 - 1.5) + 1.5).toFixed(2))
  }

  // 1º passo: escolher o time -> gera e mostra a odd antes de pedir o valor
  function escolherVencedor(ev, vencedorId) {
    setApostaAtual({ eventoId: ev.id, vencedorId, odd: calcularOdd(), valor: '' })
  }

  // 2º passo: informar o valor e confirmar
  async function confirmarAposta(ev) {
    const valor = Number(apostaAtual.valor)
    if (!valor || valor <= 0) {
      alert('Informe um valor válido')
      return
    }
    if (valor > saldo) {
      alert('Saldo insuficiente')
      return
    }
    const novaAposta = {
      id: Date.now(),
      clientId: user.id,
      vencedorId: apostaAtual.vencedorId,
      odd: apostaAtual.odd,
      valor,
    }
    try {
      await fetch(`${EVENTS}/${ev.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apostas: [...(ev.apostas || []), novaAposta] }),
      })
      await fetch(`${CLIENTS}/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ saldo: saldo - valor }),
      })
      setApostaAtual(null)
      carregarCliente()
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
        <p>Nenhum cliente logado.</p>
        <Link to="/auth">Ir para o login</Link>
      </div>
    )
  }

  // eventos com apostas abertas: agora entre a abertura das apostas e o início da partida
  const agora = new Date()
  const abertos = eventos.filter(
    (ev) =>
      !ev.fechado &&
      !ev.resolvido &&
      new Date(ev.inicioApostas) <= agora &&
      agora < new Date(ev.dataHoraPartida)
  )

  // apostas feitas por este cliente (varrendo todos os eventos)
  const minhasApostas = []
  for (const ev of eventos) {
    for (const ap of ev.apostas || []) {
      if (ap.clientId === user.id) {
        minhasApostas.push({ ...ap, evento: ev })
      }
    }
  }

  return (
    <div className="page">
      <header>
        <h1>Bem-vindo, {user.nome}</h1>
        <p>Saldo: R$ {saldo.toFixed(2)}</p>
        <div className="botoes">
          <button onClick={adicionarSaldo}>Adicionar saldo</button>
          <button onClick={() => setView('apostas')}>Minhas Apostas</button>
          <button onClick={() => setView('eventos')}>Eventos abertos</button>
        </div>
      </header>

      {view === 'eventos' && (
        <>
          <h2>Eventos abertos</h2>
          {abertos.length === 0 ? (
            <p>Nenhum evento aberto no momento.</p>
          ) : (
            <ul className="lista-eventos">
              {abertos.map((ev) => (
                <li key={ev.id}>
                  <strong>
                    {nomeClube(ev.clubeCasaId)} x {nomeClube(ev.clubeForaId)}
                  </strong>
                  <p>Partida: {formatarData(ev.dataHoraPartida)}</p>

                  {apostaAtual && apostaAtual.eventoId === ev.id ? (
                    <div>
                      <p>Palpite: {nomeClube(apostaAtual.vencedorId)}</p>
                      <p>Odd: {apostaAtual.odd}</p>
                      <input
                        type="number"
                        placeholder="Valor da aposta"
                        value={apostaAtual.valor}
                        onChange={(e) =>
                          setApostaAtual({ ...apostaAtual, valor: e.target.value })
                        }
                      />
                      <button onClick={() => confirmarAposta(ev)}>Confirmar aposta</button>
                      <button onClick={() => setApostaAtual(null)}>Cancelar</button>
                    </div>
                  ) : (
                    <>
                      <button onClick={() => escolherVencedor(ev, ev.clubeCasaId)}>
                        Apostar em {nomeClube(ev.clubeCasaId)}
                      </button>
                      <button onClick={() => escolherVencedor(ev, ev.clubeForaId)}>
                        Apostar em {nomeClube(ev.clubeForaId)}
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {view === 'apostas' && (
        <>
          <h2>Minhas apostas</h2>
          {minhasApostas.length === 0 ? (
            <p>Você ainda não fez apostas.</p>
          ) : (
            <ul className="lista-eventos">
              {minhasApostas.map((ap) => (
                <li key={ap.id}>
                  <strong>
                    {nomeClube(ap.evento.clubeCasaId)} x {nomeClube(ap.evento.clubeForaId)}
                  </strong>
                  <p>Palpite: {nomeClube(ap.vencedorId)}</p>
                  <p>Odd: {ap.odd}</p>
                  <p>Valor: R$ {Number(ap.valor || 0).toFixed(2)}</p>
                  {!ap.evento.resolvido ? (
                    <p>Aguardando resultado</p>
                  ) : ap.vencedorId === ap.evento.resultado ? (
                    <p>Ganhou! +R$ {(Number(ap.valor || 0) * ap.odd).toFixed(2)}</p>
                  ) : (
                    <p>Perdeu</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <Link to="/profile" state={{ user }}>Meus dados</Link>
      <Link to="/">Sair</Link>
    </div>
  )
}

export default ClienteDashboard
