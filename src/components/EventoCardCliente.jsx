import { nomeClube, formatarData } from '../utils/helpers'

function EventoCardCliente({ evento, apostaAtual, onEscolherVencedor, onConfirmarAposta, onCancelarAposta, onMudarValor }) {
  const { clubeCasaId, clubeForaId, dataHoraPartida } = evento
  const apostandoNeste = apostaAtual && apostaAtual.eventoId === evento.id

  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="badge bg-success">🟢 Apostas abertas</span>
          <span className="text-muted small">⚽ {formatarData(dataHoraPartida)}</span>
        </div>

        {/* Times */}
        <div className="d-flex align-items-center justify-content-center gap-3 my-3">
          <span className="fw-bold fs-5">{nomeClube(clubeCasaId)}</span>
          <span className="badge bg-light text-dark">VS</span>
          <span className="fw-bold fs-5">{nomeClube(clubeForaId)}</span>
        </div>

        {/* Fluxo de aposta */}
        {apostandoNeste ? (
          <div className="border rounded p-3 bg-light">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div>
                <div className="text-muted small text-uppercase">Seu palpite</div>
                <strong>{nomeClube(apostaAtual.vencedorId)}</strong>
              </div>
              <div className="text-center">
                <div className="text-muted small">Odd</div>
                <strong className="fs-5">{apostaAtual.odd}</strong>
              </div>
            </div>
            <div className="mb-2">
              <label className="form-label">Valor da aposta (R$)</label>
              <input
                type="number"
                className="form-control"
                placeholder="Ex: 50"
                value={apostaAtual.valor}
                min="0.01"
                step="0.01"
                onChange={(e) => onMudarValor(e.target.value)}
              />
            </div>
            {apostaAtual.valor > 0 && (
              <p className="text-success mb-2">
                Retorno potencial: <strong>R$ {(Number(apostaAtual.valor) * apostaAtual.odd).toFixed(2)}</strong>
              </p>
            )}
            <div className="d-flex gap-2">
              <button className="btn btn-primary" onClick={() => onConfirmarAposta(evento)}>✅ Confirmar aposta</button>
              <button className="btn btn-outline-secondary" onClick={onCancelarAposta}>Cancelar</button>
            </div>
          </div>
        ) : (
          <div className="d-flex gap-2">
            <button className="btn btn-outline-primary flex-fill" onClick={() => onEscolherVencedor(evento, clubeCasaId)}>
              Apostar em <strong>{nomeClube(clubeCasaId)}</strong>
            </button>
            <button className="btn btn-outline-primary flex-fill" onClick={() => onEscolherVencedor(evento, clubeForaId)}>
              Apostar em <strong>{nomeClube(clubeForaId)}</strong>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default EventoCardCliente
