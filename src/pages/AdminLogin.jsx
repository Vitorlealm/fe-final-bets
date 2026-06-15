import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API = 'http://localhost:3001/admins'

function AdminLogin() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  async function login(e) {
    e.preventDefault()
    try {
      const resposta = await fetch(`${API}?email=${email}&senha=${senha}`)
      const dados = await resposta.json()
      if (dados.length > 0) {
        navigate('/admin/profile', { state: { user: dados[0] } })
      } else {
        alert('Email ou senha inválidos')
      }
    } catch {
      alert('Não foi possível conectar à API. Verifique se o servidor está rodando (npm run server).')
    }
  }

  return (
    <div className="page">
      <h1>Login de Administrador</h1>

      <form onSubmit={login} className="formulario">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <button type="submit">Entrar</button>
      </form>
    </div>
  )
}

export default AdminLogin
