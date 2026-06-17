import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const API = 'http://localhost:3001/clients'

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

  function trocarAba(paraLogin) {
    setIsLogin(paraLogin)
    setErro('')
  }

  function forcaSenha(s) {
    if (s.length === 0) return null
    if (s.length < 6) return { nivel: 1, texto: 'Fraca', cor: '#e53e3e' }
    if (s.length < 10) return { nivel: 2, texto: 'Média', cor: '#f59e0b' }
    return { nivel: 3, texto: 'Forte', cor: '#38a169' }
  }

  const forca = forcaSenha(senha)

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
        body: JSON.stringify({ nome, email, dataNascimento, cpf, senha, perfil: 'cliente', saldo: 0 }),
      })
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
      const resposta = await fetch(`${API}?email=${email}&senha=${senha}`)
      const dados = await resposta.json()
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
    <div className="auth-page">
      {/* Painel lateral */}
      <div className="auth-lateral auth-lateral--jogador">
        <div className="auth-lateral-conteudo">
          <span className="auth-lateral-icon">⚽</span>
          <h2>BetArena</h2>
          <p>Aposte nos seus times favoritos, acompanhe o ranking e dispute os melhores prêmios fictícios.</p>
          <ul className="auth-lateral-lista">
            <li>🏆 Ranking em tempo real</li>
            <li>📊 Acompanhe suas apostas</li>
            <li>🎯 Odds geradas na hora</li>
            <li>💰 Saldo fictício ilimitado</li>
          </ul>
        </div>
      </div>

      {/* Formulário */}
      <div className="auth-formulario-area">
        <div className="auth-card">
          <div className="auth-card-header">
            <h1 className="auth-titulo">
              {isLogin ? 'Bem-vindo de volta!' : 'Criar conta'}
            </h1>
            <p className="auth-subtitulo">
              {isLogin ? 'Entre com suas credenciais para continuar' : 'Preencha os dados abaixo'}
            </p>
          </div>

          <div className="auth-abas">
            <button
              className={`auth-aba ${isLogin ? 'auth-aba--ativa' : ''}`}
              onClick={() => trocarAba(true)}
              type="button"
            >
              Login
            </button>
            <button
              className={`auth-aba ${!isLogin ? 'auth-aba--ativa' : ''}`}
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
                  <input placeholder="Seu nome completo" value={nome} onChange={(e) => setNome(e.target.value)} required />
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
              <input type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>Senha</label>
              <input type="password" placeholder="••••••••" value={senha} onChange={(e) => setSenha(e.target.value)} required />
              {!isLogin && forca && (
                <div className="senha-forca">
                  <div className="senha-forca-barra">
                    {[1, 2, 3].map((n) => (
                      <div
                        key={n}
                        className="senha-forca-segmento"
                        style={{ background: n <= forca.nivel ? forca.cor : 'var(--border)' }}
                      />
                    ))}
                  </div>
                  <span style={{ color: forca.cor }}>{forca.texto}</span>
                </div>
              )}
            </div>

            <button type="submit" className="btn-primary btn-full" disabled={carregando}>
              {carregando ? '⏳ Aguarde...' : isLogin ? 'Entrar' : 'Criar minha conta'}
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

export default Auth
