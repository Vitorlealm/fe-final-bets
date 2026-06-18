import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Navbar({ titulo, subtitulo, links = [], acoes = [], onSair }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  function sair() {
    logout()
    navigate('/')
    if (onSair) onSair()
  }

  return (
    <nav className="navbar navbar-expand bg-dark navbar-dark">
      <div className="container">
        <div className="navbar-brand">
          {titulo}
          {subtitulo && <div className="small fw-normal">{subtitulo}</div>}
        </div>
        <div className="navbar-nav ms-auto align-items-center gap-2">
          {acoes.map((acao, i) => (
            <button key={i} className="btn btn-sm btn-outline-light" onClick={acao.onClick}>
              {acao.label}
            </button>
          ))}
          {links.map((link) => (
            <Link key={link.to} to={link.to} className="nav-link">
              {link.label}
            </Link>
          ))}
          <button className="btn btn-sm btn-outline-light" onClick={sair}>
            Sair
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
