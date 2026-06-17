import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Protege uma rota verificando se há usuário logado e se o perfil bate.
 * Aceita tanto o campo `perfil` quanto o campo `tipo` para compatibilidade.
 * @param {string} perfil - 'cliente' | 'administrador' | undefined (qualquer perfil logado)
 */
function ProtectedRoute({ children, perfil }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/" replace />
  }

  // Aceita tanto `perfil` quanto `tipo` (campo legado)
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
