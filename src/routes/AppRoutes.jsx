import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Auth from '../pages/Auth'
import ProfileCliente from '../pages/ProfileCliente'
import AdminLogin from '../pages/AdminLogin'
import ProfileAdmin from '../pages/ProfileAdmin'
import AdminDashboard from '../pages/AdminDashboard'
import ClienteDashboard from '../pages/ClienteDashboard'
import Ranking from '../pages/Ranking'
import Regulamento from '../pages/Regulamento'
import ProtectedRoute from './ProtectedRoute'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/admin/cadastro" element={<AdminLogin />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/regulamento" element={<Regulamento />} />

      <Route
        path="/cliente/dashboard"
        element={
          <ProtectedRoute perfil="cliente">
            <ClienteDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute perfil="cliente">
            <ProfileCliente />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute perfil="administrador">
            <ProfileAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute perfil="administrador">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ranking"
        element={
          <ProtectedRoute>
            <Ranking />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default AppRoutes
