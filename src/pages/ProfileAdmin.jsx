import { useLocation, Link } from 'react-router-dom'

function ProfileAdmin() {
  const location = useLocation()
  const user = location.state?.user

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
      <h1>Painel do Administrador</h1>
      <p>Nome: {user.nome}</p>
      <p>Email: {user.email}</p>
      <p>Data de nascimento: {user.dataNascimento}</p>
      <p>CPF: {user.cpf}</p>
      <Link to="/">Sair</Link>
    </div>
  )
}

export default ProfileAdmin
