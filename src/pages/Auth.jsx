import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const API = 'http://localhost:3001/clients'

function Auth() {
  const location = useLocation()
  const navigate = useNavigate()

  // começa no modo escolhido na página inicial (login por padrão)
  const [isLogin, setIsLogin] = useState(location.state?.modo !== 'cadastro')

  // campos do formulário
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')
  const [cpf, setCpf] = useState('')
  const [senha, setSenha] = useState('')

  async function cadastrar(e) {
    e.preventDefault()
    try {
      // email e cpf devem ser únicos na lista de clientes
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
        body: JSON.stringify({ nome, email, dataNascimento, cpf, senha, tipo: 'cliente', saldo: 0 }),
      })
      alert('Cadastrado com sucesso! Agora faça login.')
      setIsLogin(true)
    } catch {
      alert('Não foi possível conectar à API. Verifique se o servidor está rodando (npm run server).')
    }
  }

  async function login(e) {
    e.preventDefault()
    try {
      const resposta = await fetch(`${API}?email=${email}&senha=${senha}`)
      const dados = await resposta.json()
      if (dados.length > 0) {
        navigate('/cliente/dashboard', { state: { user: dados[0] } })
      } else {
        alert('Email ou senha inválidos')
      }
    } catch {
      alert('Não foi possível conectar à API. Verifique se o servidor está rodando (npm run server).')
    }
  }

  return (
    <div className="page">
      <h1>{isLogin ? 'Login' : 'Cadastro'}</h1>

      <form onSubmit={isLogin ? login : cadastrar} className="formulario">
        {!isLogin && (
          <>
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
          </>
        )}

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

        <button type="submit">{isLogin ? 'Entrar' : 'Cadastrar'}</button>
      </form>

      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre'}
      </button>
    </div>
  )
}

export default Auth
