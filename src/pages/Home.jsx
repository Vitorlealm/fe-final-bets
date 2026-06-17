import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="home-logo">🏆</div>
        <h1 className="home-titulo">BetArena</h1>
        <p className="home-subtitulo">
          Plataforma acadêmica de apostas esportivas fictícias
        </p>
      </div>

      <div className="home-cards">
        {/* Card Jogador */}
        <div className="home-card home-card--jogador">
          <div className="home-card-icon">⚽</div>
          <h2>Sou Jogador</h2>
          <p>Acesse sua conta, faça apostas fictícias e acompanhe seu desempenho no ranking.</p>
          <div className="home-card-botoes">
            <button
              className="btn-primary"
              onClick={() => navigate('/auth', { state: { modo: 'login' } })}
            >
              Entrar
            </button>
            <button
              className="btn-secondary"
              onClick={() => navigate('/auth', { state: { modo: 'cadastro' } })}
            >
              Criar conta
            </button>
          </div>
        </div>

        {/* Divisor */}
        <div className="home-divisor">ou</div>

        {/* Card Administrador */}
        <div className="home-card home-card--admin">
          <div className="home-card-icon">🛡️</div>
          <h2>Sou Administrador</h2>
          <p>Gerencie eventos, controle apostas e acompanhe os resultados da plataforma.</p>
          <div className="home-card-botoes">
            <button
              className="btn-primary"
              onClick={() => navigate('/admin/login')}
            >
              Entrar
            </button>
            <button
              className="btn-secondary"
              onClick={() => navigate('/admin/cadastro')}
            >
              Criar conta
            </button>
          </div>
        </div>
      </div>

      <p className="home-aviso">
        ⚠️ Plataforma de uso exclusivamente acadêmico. Todos os valores são fictícios.
      </p>
    </div>
  )
}

export default Home
