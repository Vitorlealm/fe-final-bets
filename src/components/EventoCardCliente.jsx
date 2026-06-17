import clubes from '../data/clubes.json'

function nomeClube(id) {
  const clube = clubes.find(c => c.id === Number(id))
  return clube ? clube.nome : '?'
}

function formatarData(valor) {
  return new Date(valor).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}

function EventoCardCliente({ evento, apostaAtual, onEscolherVencedor, onConfirmarAposta, onCancelarAposta, onMudarValor }) {
  const { clubeCasaId, clubeForaId, dataHoraPartida } = evento
  const apostandoNeste = apostaAtual && apostaAtual.eventoId === evento.id

  return (
    <li className="evento-card evento-card--aberto">
      <div className="evento-card-top">
        <span className="evento-badge evento-badge--aberto">🟢 Apostas abertas</span>
        <span className="evento-data-badge">⚽ {formatarData(dataHoraPartida)}</span>
      </div>

      {/* Times */}
      <div className="evento-times">
        <span className="evento-time">{nomeClube(clubeCasaId)}</span>
        <span className="evento-vs">VS</span>
        <span className="evento-time">{nomeClube(clubeForaId)}</span>
      </div>

      {/* Fluxo de aposta */}
      {apostandoNeste ? (
        <div className="aposta-form">
          <div className="aposta-form-info">
            <div>
              <span className="aposta-form-label">Seu palpite</span>
              <strong>{nomeClube(apostaAtual.vencedorId)}</strong>
            </div>
            <div className="aposta-odd-badge">
              <span>Odd</span>
              <strong>{apostaAtual.odd}</strong>
            </div>
          </div>
          <div className="form-group">
            <label>Valor da aposta (R$)</label>
            <input
              type="number"
              placeholder="Ex: 50"
              value={apostaAtual.valor}
              min="0.01"
              step="0.01"
              onChange={e => onMudarValor(e.target.value)}
            />
          </div>
          {apostaAtual.valor > 0 && (
            <p className="aposta-retorno">
              Retorno potencial: <strong>R$ {(Number(apostaAtual.valor) * apostaAtual.odd).toFixed(2)}</strong>
            </p>
          )}
          <div className="evento-acoes">
            <button className="btn-primary" onClick={() => onConfirmarAposta(evento)}>✅ Confirmar aposta</button>
            <button className="btn-secondary" onClick={onCancelarAposta}>Cancelar</button>
          </div>
        </div>
      ) : (
        <div className="evento-acoes">
          <button className="btn-apostar" onClick={() => onEscolherVencedor(evento, clubeCasaId)}>
            Apostar em <strong>{nomeClube(clubeCasaId)}</strong>
          </button>
          <button className="btn-apostar" onClick={() => onEscolherVencedor(evento, clubeForaId)}>
            Apostar em <strong>{nomeClube(clubeForaId)}</strong>
          </button>
        </div>
      )}
    </li>
  )
}

export default EventoCardCliente
