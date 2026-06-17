import clubes from '../data/clubes.json'

function nomeClube(id) {
  const clube = clubes.find(c => c.id === Number(id))
  return clube ? clube.nome : '?'
}

function formatarData(valor) {
  return new Date(valor).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}

function EventoCardAdmin({ evento, onEditar, onExcluir, onFechar, onGerarResultado }) {
  const { clubeCasaId, clubeForaId, dataHoraPartida, inicioApostas, apostas, fechado, resolvido, resultado } = evento

  return (
    <li className={`evento-card ${resolvido ? 'evento-card--resolvido' : fechado ? 'evento-card--fechado' : 'evento-card--aberto'}`}>
      {/* Badge de status */}
      <div className="evento-card-top">
        {resolvido
          ? <span className="evento-badge evento-badge--resolvido">✅ Resolvido</span>
          : fechado
            ? <span className="evento-badge evento-badge--fechado">🔒 Fechado</span>
            : <span className="evento-badge evento-badge--aberto">🟢 Aberto</span>
        }
        <span className="evento-apostas-count">🎰 {(apostas || []).length} aposta{(apostas || []).length !== 1 ? 's' : ''}</span>
      </div>

      {/* Times */}
      <div className="evento-times">
        <span className="evento-time">{nomeClube(clubeCasaId)}</span>
        <span className="evento-vs">VS</span>
        <span className="evento-time">{nomeClube(clubeForaId)}</span>
      </div>

      {/* Datas */}
      <div className="evento-datas">
        <span>⚽ Partida: {formatarData(dataHoraPartida)}</span>
        <span>🔓 Apostas: {formatarData(inicioApostas)}</span>
      </div>

      {/* Resultado */}
      {resolvido && (
        <div className="evento-resultado-box">
          🏆 Vencedor: <strong>{nomeClube(resultado)}</strong>
        </div>
      )}

      {/* Ações principais */}
      {!resolvido && (
        <div className="evento-acoes">
          <button
            className={fechado ? 'btn-secondary' : 'btn-primary btn-admin'}
            onClick={() => onFechar(evento)}
            disabled={fechado}
          >
            🔒 {fechado ? 'Apostas fechadas' : 'Fechar apostas'}
          </button>
          <button
            className="btn-primary"
            onClick={() => onGerarResultado(evento)}
            disabled={!fechado}
          >
            🎲 Gerar resultado
          </button>
        </div>
      )}

      {/* Ações secundárias */}
      <div className="evento-acoes-secundarias">
        <button onClick={() => onEditar(evento)}>✏️ Editar</button>
        <button className="btn-danger" onClick={() => onExcluir(evento.id)}>🗑️ Excluir</button>
      </div>
    </li>
  )
}

export default EventoCardAdmin
