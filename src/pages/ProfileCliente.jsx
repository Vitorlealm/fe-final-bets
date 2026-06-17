import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'

function ProfileCliente() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="page">
        <p>Nenhum usuário logado.</p>
        <Link to="/">Voltar</Link>
      </div>
    )
  }

  return (
    <div className="page">
      <Navbar
        titulo="Meus Dados"
        links={[{ to: '/cliente/dashboard', label: '← Voltar ao dashboard' }]}
      />

      <div className="perfil-card">
        <div className="perfil-campo">
          <span>Nome</span>
          <span>{user.nome}</span>
        </div>
        <div className="perfil-divisor" />
        <div className="perfil-campo">
          <span>E-mail</span>
          <span>{user.email}</span>
        </div>
        <div className="perfil-divisor" />
        <div className="perfil-campo">
          <span>Data de nascimento</span>
          <span>{user.dataNascimento}</span>
        </div>
        <div className="perfil-divisor" />
        <div className="perfil-campo">
          <span>CPF</span>
          <span>{user.cpf}</span>
        </div>
        <div className="perfil-divisor" />
        <div className="perfil-campo">
          <span>Saldo fictício</span>
          <span>R$ {Number(user.saldo || 0).toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}

export default ProfileCliente
