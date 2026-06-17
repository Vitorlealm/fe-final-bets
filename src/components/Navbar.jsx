import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Barra de navegação reutilizável.
 * Recebe um array de `links` e `acoes` para renderizar os botões corretos por perfil.
 *
 * links: [{ to: '/rota', label: 'Texto' }]
 * acoes: [{ label: 'Texto', onClick: fn }]
 */
function Navbar({ titulo, subtitulo, links = [], acoes = [], onSair }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  function sair() {
    logout()
    navigate('/')
    if (onSair) onSair()
  }

  return (
    <header className="navbar">
      <div className="navbar-info">
        <h1>{titulo}</h1>
        {subtitulo && <p className="navbar-subtitulo">{subtitulo}</p>}
      </div>
      <nav className="navbar-nav">
        {acoes.map((acao, i) => (
          <button key={i} onClick={acao.onClick}>
            {acao.label}
          </button>
        ))}
        {links.map((link) => (
          <Link key={link.to} to={link.to}>
            {link.label}
          </Link>
        ))}
        <button className="btn-sair" onClick={sair}>
          Sair
        </button>
      </nav>
    </header>
  )
}

export default Navbar
