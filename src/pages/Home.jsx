import { useNavigate, Link } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  return (
    <div className="container py-5 text-center">
      <div className="mb-5">
        <div className="display-3">🏆</div>
        <h1 className="fw-bold">BetArena</h1>
        <p className="text-muted">Plataforma acadêmica de apostas esportivas fictícias</p>
      </div>

      <div className="row justify-content-center g-4">
        <div className="col-12 col-md-5">
          <div className="card h-100 shadow-sm">
            <div className="card-body d-flex flex-column">
              <div className="fs-1">⚽</div>
              <h2 className="h4">Sou Jogador</h2>
              <p className="text-muted flex-grow-1">
                Acesse sua conta, faça apostas fictícias e acompanhe seu desempenho no ranking.
              </p>
              <div className="d-grid gap-2">
                <button className="btn btn-primary" onClick={() => navigate('/auth', { state: { modo: 'login' } })}>
                  Entrar
                </button>
                <button className="btn btn-outline-secondary" onClick={() => navigate('/auth', { state: { modo: 'cadastro' } })}>
                  Criar conta
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-5">
          <div className="card h-100 shadow-sm">
            <div className="card-body d-flex flex-column">
              <div className="fs-1">🛡️</div>
              <h2 className="h4">Sou Administrador</h2>
              <p className="text-muted flex-grow-1">
                Gerencie eventos, controle apostas e acompanhe os resultados da plataforma.
              </p>
              <div className="d-grid gap-2">
                <button className="btn btn-primary" onClick={() => navigate('/admin/login')}>
                  Entrar
                </button>
                <button className="btn btn-outline-secondary" onClick={() => navigate('/admin/cadastro')}>
                  Criar conta
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="text-muted small mt-4">
        ⚠️ Plataforma de uso exclusivamente acadêmico. Todos os valores são fictícios.
      </p>
      <Link to="/regulamento">📋 Ler o regulamento</Link>
    </div>
  )
}

export default Home
