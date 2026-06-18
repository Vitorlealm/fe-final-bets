import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const salvo = localStorage.getItem('user')
    return salvo ? JSON.parse(salvo) : null
  })

  function login(userData) {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  function logout() {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
