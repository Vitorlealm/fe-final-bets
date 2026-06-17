import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const API = 'http://localhost:3001/admins'

function AdminLogin() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [isLogin, setIsLogin] = useState(true)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')
  const [cpf, setCpf] = useState('')
  const [senha, setSenha] = useState('')

  function trocarAba(paraLogin) {
    setIsLogin(paraLogin)
    setErro('')
  }

  async function cadastrar(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      const porEmail = await (await fetch(`${API}?email=${email}`)).json()
      if (porEmail.length > 0) { setErro('Este e-mail já está cadastrado.'); return }
      const porCpf = await (await fetch(`${API}?cpf=${cpf}`)).json()
      if (porCpf.length > 0) { setErro('Este CPF já está cadastrado.'); return }

      await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, dataNascimento, cpf, senha, perfil: 'administrador' }),
      })
      trocarAba(true)
      setErro('✅ Administrador cadastrado! Faça login para continuar.')
    } catch {
      setErro('Não foi possível conectar à API. Verifique se o servidor está rodando.')
    } finally {
      setCarregando(false)
    }
  }

  async function loginHandler(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      const resposta = await fetch(`${API}?email=${email}&senha=${senha}`)
      const dados = await resposta.json()
      if (dados.length > 0) {
        login(dados[0])
        navigate('/admin/dashboard')
      } else {
        setErro('E-mail ou senha inválidos. Tente novamente.')
      }
    } catch {
      setErro('Não foi possível conectar à API. Verifique se o servidor está rodando.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="auth-page">
      {/* Painel lateral admin */}
      <div className="auth-lateral auth-lateral--admin">
        <div className="auth-lateral-conteudo">
          <span className="auth-lateral-icon">🛡️</span>
          <h2>Área Restrita</h2>
          <p>Acesso exclusivo para administradores da plataforma BetArena.</p>
          <ul className="auth-lateral-lista">
            <li>⚙️ Gerencie eventos</li>
            <li>🔒 Controle as apostas</li>
            <li>🎲 Gere resultados</li>
            <li>📈 Acompanhe o ranking</li>
          </ul>
        </div>
      </div>

      {/* Formulário */}
      <div className="auth-formulario-area">
        <div className="auth-card auth-card--admin">
          <div className="auth-card-header">
            <h1 className="auth-titulo">
              {isLogin ? 'Acesso Administrativo' : 'Novo Administrador'}
            </h1>
            <p className="auth-subtitulo">
              {isLogin ? 'Entre com suas credenciais de administrador' : 'Preencha os dados para criar uma conta'}
            </p>
          </div>

          <div className="auth-abas auth-abas--admin">
            <button
              className={`auth-aba ${isLogin ? 'auth-aba--ativa auth-aba--ativa-admin' : ''}`}
              onClick={() => trocarAba(true)}
              type="button"
            >
              Login
            </button>
            <button
              className={`auth-aba ${!isLogin ? 'auth-aba--ativa auth-aba--ativa-admin' : ''}`}
              onClick={() => trocarAba(false)}
              type="button"
            >
              Cadastro
            </button>
          </div>

          {erro && (
            <div className={`auth-mensagem ${erro.startsWith('✅') ? 'auth-mensagem--ok' : 'auth-mensagem--erro'}`}>
              {erro}
            </div>
          )}

          <form onSubmit={isLogin ? loginHandler : cadastrar} className="auth-form">
            {!isLogin && (
              <>
                <div className="form-group">
                  <label>Nome completo</label>
                  <input placeholder="Nome do administrador" value={nome} onChange={(e) => setNome(e.target.value)} required />
                </div>
                <div className="auth-form-linha">
                  <div className="form-group">
                    <label>Data de nascimento</label>
                    <input type="date" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>CPF</label>
                    <input placeholder="000.000.000-00" value={cpf} onChange={(e) => setCpf(e.target.value)} required />
                  </div>
                </div>
              </>
            )}

            <div className="form-group">
              <label>E-mail</label>
              <input type="email" placeholder="admin@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Senha</label>
              <input type="password" placeholder="••••••••" value={senha} onChange={(e) => setSenha(e.target.value)} required />
            </div>

            <button type="submit" className="btn-primary btn-full btn-admin" disabled={carregando}>
              {carregando ? '⏳ Aguarde...' : isLogin ? 'Entrar como Admin' : 'Criar conta admin'}
            </button>
          </form>

          <div className="auth-rodape">
            <Link to="/">← Voltar à tela inicial</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
