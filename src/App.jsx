import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import ProfileCliente from './pages/ProfileCliente'
import AdminCadastro from './pages/AdminCadastro'
import AdminLogin from './pages/AdminLogin'
import ProfileAdmin from './pages/ProfileAdmin'
import AdminDashboard from './pages/AdminDashboard'
import ClienteDashboard from './pages/ClienteDashboard'
import Ranking from './pages/Ranking'
import Regulamento from './pages/Regulamento'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/admin/cadastro" element={<AdminLogin />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/regulamento" element={<Regulamento />} />

      {/* Rotas protegidas — apenas clientes */}
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

      {/* Rotas protegidas — apenas administradores */}
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

      {/* Rotas acessíveis por qualquer usuário logado */}
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

export default App
