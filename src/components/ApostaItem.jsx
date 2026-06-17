import { nomeClube } from '../utils/helpers'

function ApostaItem({ aposta }) {
  const { vencedorId, odd, valor, evento } = aposta
  const ganhou = evento.resolvido && vencedorId === evento.resultado
  const perdeu = evento.resolvido && vencedorId !== evento.resultado
  const premio = Number(valor || 0) * odd

  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          {!evento.resolvido && <span className="badge bg-secondary">⏳ Aguardando</span>}
          {ganhou && <span className="badge bg-success">🏆 Ganhou!</span>}
          {perdeu && <span className="badge bg-danger">❌ Perdeu</span>}
          <span className="text-muted small">Odd {odd}</span>
        </div>

        <div className="d-flex align-items-center justify-content-center gap-3 my-3">
          <span className="fw-bold fs-5">{nomeClube(evento.clubeCasaId)}</span>
          <span className="badge bg-light text-dark">VS</span>
          <span className="fw-bold fs-5">{nomeClube(evento.clubeForaId)}</span>
        </div>

        <div className="d-flex flex-wrap gap-4">
          <div>
            <div className="text-muted small text-uppercase">Palpite</div>
            <strong>{nomeClube(vencedorId)}</strong>
          </div>
          <div>
            <div className="text-muted small text-uppercase">Valor apostado</div>
            <strong>R$ {Number(valor || 0).toFixed(2)}</strong>
          </div>
          {ganhou && (
            <div>
              <div className="text-muted small text-uppercase">Prêmio recebido</div>
              <strong className="text-success">+R$ {premio.toFixed(2)}</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ApostaItem
