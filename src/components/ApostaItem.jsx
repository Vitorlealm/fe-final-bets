import clubes from '../data/clubes.json'

function nomeClube(id) {
  const clube = clubes.find(c => c.id === Number(id))
  return clube ? clube.nome : '?'
}

function ApostaItem({ aposta }) {
  const { vencedorId, odd, valor, evento } = aposta
  const ganhou = evento.resolvido && vencedorId === evento.resultado
  const perdeu = evento.resolvido && vencedorId !== evento.resultado
  const premio = Number(valor || 0) * odd

  return (
    <li className={`evento-card aposta-item ${ganhou ? 'aposta-item--ganhou' : perdeu ? 'aposta-item--perdeu' : ''}`}>
      <div className="evento-card-top">
        {!evento.resolvido && <span className="evento-badge evento-badge--aguardando">⏳ Aguardando</span>}
        {ganhou  && <span className="evento-badge evento-badge--ganhou">🏆 Ganhou!</span>}
        {perdeu  && <span className="evento-badge evento-badge--perdeu">❌ Perdeu</span>}
        <span className="evento-odd-badge">Odd {odd}</span>
      </div>

      <div className="evento-times">
        <span className="evento-time">{nomeClube(evento.clubeCasaId)}</span>
        <span className="evento-vs">VS</span>
        <span className="evento-time">{nomeClube(evento.clubeForaId)}</span>
      </div>

      <div className="aposta-item-detalhes">
        <div>
          <span className="aposta-form-label">Palpite</span>
          <strong>{nomeClube(vencedorId)}</strong>
        </div>
        <div>
          <span className="aposta-form-label">Valor apostado</span>
          <strong>R$ {Number(valor || 0).toFixed(2)}</strong>
        </div>
        {ganhou && (
          <div>
            <span className="aposta-form-label">Prêmio recebido</span>
            <strong className="aposta-ganhou">+R$ {premio.toFixed(2)}</strong>
          </div>
        )}
      </div>
    </li>
  )
}

export default ApostaItem
