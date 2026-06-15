import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import ProfileCliente from './pages/ProfileCliente'
import AdminCadastro from './pages/AdminCadastro'
import AdminLogin from './pages/AdminLogin'
import ProfileAdmin from './pages/ProfileAdmin'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/profile" element={<ProfileCliente />} />
      <Route path="/admin/cadastro" element={<AdminCadastro />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/profile" element={<ProfileAdmin />} />
    </Routes>
  )
}

export default App
