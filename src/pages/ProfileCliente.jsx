import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'

function ProfileCliente() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="container my-4">
        <p>Nenhum usuário logado.</p>
        <Link to="/">Voltar</Link>
      </div>
    )
  }

  return (
    <>
      <Navbar
        titulo="Meus Dados"
        links={[{ to: '/cliente/dashboard', label: '← Voltar ao dashboard' }]}
      />

      <div className="container my-4" style={{ maxWidth: '520px' }}>
        <div className="card">
          <ul className="list-group list-group-flush">
            <li className="list-group-item d-flex justify-content-between">
              <span className="text-muted">Nome</span><span>{user.nome}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between">
              <span className="text-muted">E-mail</span><span>{user.email}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between">
              <span className="text-muted">Data de nascimento</span><span>{user.dataNascimento}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between">
              <span className="text-muted">CPF</span><span>{user.cpf}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between">
              <span className="text-muted">Saldo fictício</span><span>R$ {Number(user.saldo || 0).toFixed(2)}</span>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default ProfileCliente
