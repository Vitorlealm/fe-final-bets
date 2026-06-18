import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function ProtectedRoute({ children, perfil }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/" replace />
  }

  const perfilUsuario = user.perfil || user.tipo

  if (perfil && perfilUsuario !== perfil) {
    if (perfilUsuario === 'administrador') {
      return <Navigate to="/admin/dashboard" replace />
    }
    return <Navigate to="/cliente/dashboard" replace />
  }

  return children
}

export default ProtectedRoute
