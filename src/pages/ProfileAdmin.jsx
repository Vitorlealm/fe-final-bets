import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

function ProfileAdmin() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="page">
        <p>Nenhum administrador logado.</p>
        <Link to="/">Voltar</Link>
      </div>
    )
  }

  return (
    <div className="page">
      <Navbar
        titulo="Painel do Administrador"
        links={[{ to: '/admin/dashboard', label: '← Voltar ao dashboard' }]}
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
          <span>Perfil</span>
          <span>🛡️ Administrador</span>
        </div>
      </div>
    </div>
  )
}

export default ProfileAdmin
