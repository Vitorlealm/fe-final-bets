import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { findClientByEmail, findClientByCpf, createClient, loginClient } from '../services/clientsService'

function Auth() {
  const location = useLocation()
  const navigate = useNavigate()
  const { login } = useAuth()

  const [isLogin, setIsLogin] = useState(location.state?.modo !== 'cadastro')
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')
  const [cpf, setCpf] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')

  function trocarAba(paraLogin) {
    setIsLogin(paraLogin)
    setErro('')
  }

  // Classifica a força da senha pelo tamanho (nível 1 a 3) e devolve a cor do Bootstrap.
  function forcaSenha(s) {
    if (s.length === 0) return null
    if (s.length < 6) return { nivel: 1, texto: 'Fraca', classe: 'bg-danger' }
    if (s.length < 10) return { nivel: 2, texto: 'Média', classe: 'bg-warning' }
    return { nivel: 3, texto: 'Forte', classe: 'bg-success' }
  }

  const forca = forcaSenha(senha)

  async function cadastrar(e) {
    e.preventDefault()
    setErro('')
    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem. Verifique e tente novamente.')
      return
    }
    setCarregando(true)
    try {
      const porEmail = await findClientByEmail(email)
      if (porEmail.length > 0) { setErro('Este e-mail já está cadastrado.'); return }
      const porCpf = await findClientByCpf(cpf)
      if (porCpf.length > 0) { setErro('Este CPF já está cadastrado.'); return }

      await createClient({ nome, email, dataNascimento, cpf, senha, perfil: 'cliente', saldo: 0 })
      setErro('')
      trocarAba(true)
      // pequena mensagem de sucesso
      setErro('✅ Cadastro realizado! Faça login para continuar.')
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
      const dados = await loginClient(email, senha)
      if (dados.length > 0) {
        login(dados[0])
        navigate('/cliente/dashboard')
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
    <div className="container py-5">
      <div className="card mx-auto shadow-sm" style={{ maxWidth: '480px' }}>
        <div className="card-body">
          <h1 className="h4 text-center">{isLogin ? 'Bem-vindo de volta!' : 'Criar conta'}</h1>
          <p className="text-muted text-center">
            {isLogin ? 'Entre com suas credenciais para continuar' : 'Preencha os dados abaixo'}
          </p>

          {/* Abas Login / Cadastro */}
          <ul className="nav nav-tabs mb-3">
            <li className="nav-item">
              <button type="button" className={`nav-link ${isLogin ? 'active' : ''}`} onClick={() => trocarAba(true)}>
                Login
              </button>
            </li>
            <li className="nav-item">
              <button type="button" className={`nav-link ${!isLogin ? 'active' : ''}`} onClick={() => trocarAba(false)}>
                Cadastro
              </button>
            </li>
          </ul>

          {erro && (
            <div className={`alert ${erro.startsWith('✅') ? 'alert-success' : 'alert-danger'}`}>{erro}</div>
          )}

          <form onSubmit={isLogin ? loginHandler : cadastrar}>
            {!isLogin && (
              <>
                <div className="mb-3">
                  <label className="form-label">Nome completo</label>
                  <input className="form-control" placeholder="Seu nome completo" value={nome} onChange={(e) => setNome(e.target.value)} required />
                </div>
                <div className="row">
                  <div className="col mb-3">
                    <label className="form-label">Data de nascimento</label>
                    <input type="date" className="form-control" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} required />
                  </div>
                  <div className="col mb-3">
                    <label className="form-label">CPF</label>
                    <input className="form-control" placeholder="000.000.000-00" value={cpf} onChange={(e) => setCpf(e.target.value)} required />
                  </div>
                </div>
              </>
            )}

            <div className="mb-3">
              <label className="form-label">E-mail</label>
              <input type="email" className="form-control" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Senha</label>
              <input type="password" className="form-control" placeholder="••••••••" value={senha} onChange={(e) => setSenha(e.target.value)} required />
              {!isLogin && forca && (
                <div className="mt-2">
                  <div className="progress" style={{ height: '6px' }}>
                    <div className={`progress-bar ${forca.classe}`} style={{ width: `${forca.nivel * 33.33}%` }} />
                  </div>
                  <small className="text-muted">{forca.texto}</small>
                </div>
              )}
            </div>

            {!isLogin && (
              <div className="mb-3">
                <label className="form-label">Confirmar senha</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  required
                />
                {confirmarSenha && senha !== confirmarSenha && <span className="text-danger small">As senhas não coincidem</span>}
                {confirmarSenha && senha === confirmarSenha && <span className="text-success small">✓ Senhas coincidem</span>}
              </div>
            )}

            <button type="submit" className="btn btn-primary w-100" disabled={carregando}>
              {carregando ? '⏳ Aguarde...' : isLogin ? 'Entrar' : 'Criar minha conta'}
            </button>
          </form>

          <div className="text-center mt-3">
            <Link to="/">← Voltar à tela inicial</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth
