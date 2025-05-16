// context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react'
import { type AuthContextType } from '@/types/auth'

export const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [user, setUser] = useState<AuthContextType["user"]>({
      id: null,
      email: '',
      phone: '',
      fullName: '',
      role: null,
    })
  
    useEffect(() => {
      const token = localStorage.getItem('token')
      const id = localStorage.getItem('userId')
      const email = localStorage.getItem('email')
      const phone = localStorage.getItem('phone')
      const fullName = localStorage.getItem('fullName')
      const role = localStorage.getItem('role')
  
      if (token && id && email && role) {
        setIsAuthenticated(true)
        setUser({
          id,
          email,
          phone: phone ?? '',
          fullName: fullName ?? '',
          role,
        })
      }
    }, [])
  
    const setAuthData: AuthContextType["setAuthData"] = (data) => {
      localStorage.setItem('token', data.token)
      localStorage.setItem('userId', data.userId)
      localStorage.setItem('email', data.email)
      localStorage.setItem('phone', data.phone)
      localStorage.setItem('fullName', data.fullName)
      localStorage.setItem('role', data.role)
  
      setIsAuthenticated(true)
      setUser({
        id: data.userId,
        email: data.email,
        phone: data.phone,
        fullName: data.fullName,
        role: data.role,
      })
    }
  
    const logout = () => {
      localStorage.clear()
      setIsAuthenticated(false)
      setUser({
        id: null,
        email: '',
        phone: '',
        fullName: '',
        role: null,
      })
    }
  
    return (
      <AuthContext.Provider value={{ isAuthenticated, user, setAuthData, logout }}>
        {children}
      </AuthContext.Provider>
    )
  }
  

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('AuthContext not found')
  return context
}
