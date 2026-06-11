import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"

function Navbar({ onMenuToggle }) {
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
    <nav className="bg-slate-900 text-white px-4 py-3 shadow-lg">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={onMenuToggle}
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Toggle menu">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-sm">
            ISP
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight hidden sm:block">ISP Monitoring Dashboard</h1>
            <h1 className="text-base font-bold leading-tight sm:hidden">ISP Dashboard</h1>
            <p className="text-xs text-slate-400 hidden md:block">Network Operations Center</p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-6 text-sm">
          <div className="hidden md:flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-slate-300">System Online</span>
          </div>
          <div className="text-right hidden sm:block">
            <p className="font-mono text-sm">
              {time.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </p>
            <p className="text-xs text-slate-400">
              {time.toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          {user && (
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-xs text-slate-400 hidden sm:inline">{user.username} <span className="text-blue-300">({user.role})</span></span>
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
