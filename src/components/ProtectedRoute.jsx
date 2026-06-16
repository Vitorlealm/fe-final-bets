import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Protege uma rota verificando se há usuário logado e se o perfil bate.
 * @param {string} perfil - 'cliente' | 'administrador' | undefined (qualquer perfil logado)
 */
function ProtectedRoute({ children, perfil }) {
  const { user } = useAuth()

  if (!user) {
    // Não está logado — redireciona para a home
    return <Navigate to="/" replace />
  }

  if (perfil && user.perfil !== perfil) {
    // Perfil errado — redireciona para o dashboard correto
    if (user.perfil === 'administrador') {
      return <Navigate to="/admin/dashboard" replace />
    }
    return <Navigate to="/cliente/dashboard" replace />
  }

  return children
}

export default ProtectedRoute
