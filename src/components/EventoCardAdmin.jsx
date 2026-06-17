import { nomeClube, formatarData } from '../utils/helpers'

function EventoCardAdmin({ evento, onEditar, onExcluir, onFechar, onGerarResultado }) {
  const { clubeCasaId, clubeForaId, dataHoraPartida, inicioApostas, apostas, fechado, resolvido, resultado } = evento
  const qtdApostas = (apostas || []).length

  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        {/* Badge de status */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          {resolvido ? (
            <span className="badge bg-secondary">✅ Resolvido</span>
          ) : fechado ? (
            <span className="badge bg-warning text-dark">🔒 Fechado</span>
          ) : (
            <span className="badge bg-success">🟢 Aberto</span>
          )}
          <span className="text-muted small">🎰 {qtdApostas} aposta{qtdApostas !== 1 ? 's' : ''}</span>
        </div>

        {/* Times */}
        <div className="d-flex align-items-center justify-content-center gap-3 my-3">
          <span className="fw-bold fs-5">{nomeClube(clubeCasaId)}</span>
          <span className="badge bg-light text-dark">VS</span>
          <span className="fw-bold fs-5">{nomeClube(clubeForaId)}</span>
        </div>

        {/* Datas */}
        <div className="d-flex flex-wrap gap-3 text-muted small mb-2">
          <span>⚽ Partida: {formatarData(dataHoraPartida)}</span>
          <span>🔓 Apostas: {formatarData(inicioApostas)}</span>
        </div>

        {/* Resultado */}
        {resolvido && (
          <div className="alert alert-info py-2 mb-2">
            🏆 Vencedor: <strong>{nomeClube(resultado)}</strong>
          </div>
        )}

        {/* Ações principais */}
        {!resolvido && (
          <div className="d-flex gap-2 mb-2">
            <button
              className={fechado ? 'btn btn-outline-secondary' : 'btn btn-warning'}
              onClick={() => onFechar(evento)}
              disabled={fechado}
            >
              🔒 {fechado ? 'Apostas fechadas' : 'Fechar apostas'}
            </button>
            <button
              className="btn btn-primary"
              onClick={() => onGerarResultado(evento)}
              disabled={!fechado}
            >
              🎲 Gerar resultado
            </button>
          </div>
        )}

        {/* Ações secundárias */}
        <div className="d-flex gap-2 border-top pt-2">
          <button className="btn btn-sm btn-outline-secondary" onClick={() => onEditar(evento)}>✏️ Editar</button>
          <button className="btn btn-sm btn-danger" onClick={() => onExcluir(evento.id)}>🗑️ Excluir</button>
        </div>
      </div>
    </div>
  )
}

export default EventoCardAdmin
