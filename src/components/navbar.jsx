import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"

function Navbar() {
  const [time, setTime] = useState(new Date())
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <nav className="bg-slate-900 text-white px-6 py-3 shadow-lg">
      <div className="flex justify-between items-center px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-sm">
            ISP
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">ISP Monitoring Dashboard</h1>
            <p className="text-xs text-slate-400">Network Operations Center</p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <div className="hidden md:flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-slate-300">System Online</span>
          </div>
          <div className="text-right">
            <p className="font-mono text-sm">
              {time.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </p>
            <p className="text-xs text-slate-400">
              {time.toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          {user && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">{user.username}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500/20 hover:bg-red-500/40 text-red-300 hover:text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
