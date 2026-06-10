import { createContext, useContext, useState, useEffect } from "react"
import { loginAPI } from "../services/api"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem("smyid_user")
    const token = localStorage.getItem("smyid_token")
    if (saved && token) {
      setUser(JSON.parse(saved))
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    try {
      const result = await loginAPI(username, password)
      if (result.success) {
        const userData = { username: result.user.username, role: result.user.role }
        setUser(userData)
        localStorage.setItem("smyid_user", JSON.stringify(userData))
        localStorage.setItem("smyid_token", result.token)
        return { success: true }
      }
      return { success: false, message: result.message }
    } catch (err) {
      console.error("Login error:", err)
      return { success: false, message: "Tidak dapat terhubung ke server" }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("smyid_user")
    localStorage.removeItem("smyid_token")
  }

  if (loading) return null

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
