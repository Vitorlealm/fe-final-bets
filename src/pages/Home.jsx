import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  return (
    <div className="page">
      <header>
        <h1>Bem-vindo</h1>
      </header>

      <div className="botoes">
        <button onClick={() => navigate('/auth', { state: { modo: 'login' } })}>
          Login
        </button>
        <button onClick={() => navigate('/auth', { state: { modo: 'cadastro' } })}>
          Cadastrar
        </button>
      </div>
    </div>
  )
}

export default Home
