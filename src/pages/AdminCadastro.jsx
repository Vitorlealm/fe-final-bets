import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API = 'http://localhost:3001/admins'

function AdminCadastro() {
  const navigate = useNavigate()

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')
  const [cpf, setCpf] = useState('')
  const [senha, setSenha] = useState('')

  async function cadastrar(e) {
    e.preventDefault()
    try {
      // email e cpf devem ser únicos na lista de administradores
      const porEmail = await (await fetch(`${API}?email=${email}`)).json()
      if (porEmail.length > 0) {
        alert('Email já cadastrado')
        return
      }
      const porCpf = await (await fetch(`${API}?cpf=${cpf}`)).json()
      if (porCpf.length > 0) {
        alert('CPF já cadastrado')
        return
      }

      await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, dataNascimento, cpf, senha, tipo: 'administrador' }),
      })
      alert('Administrador cadastrado!')
      navigate('/admin/login')
    } catch {
      alert('Não foi possível conectar à API. Verifique se o servidor está rodando (npm run server).')
    }
  }

  return (
    <div className="page">
      <h1>Cadastro de Administrador</h1>

      <form onSubmit={cadastrar} className="formulario">
        <input
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          type="date"
          value={dataNascimento}
          onChange={(e) => setDataNascimento(e.target.value)}
        />
        <input
          placeholder="CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
        />
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

        <button type="submit">Cadastrar</button>
      </form>
    </div>
  )
}

export default AdminCadastro
