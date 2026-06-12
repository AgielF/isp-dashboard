import { NavLink } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const allNavItems = [
  { to: "/", label: "Dashboard", icon: "📊", roles: ["admin", "operator", "finance", "technician"] },
  { to: "/routers", label: "Router", icon: "📡", roles: ["admin", "operator"] },
  { to: "/clients", label: "Pelanggan", icon: "👥", roles: ["admin", "operator"] },
  { to: "/installations", label: "Pemasangan Baru", icon: "🔌", roles: ["admin", "operator", "technician"] },
  { to: "/maintenance", label: "Maintenance", icon: "🔧", roles: ["admin", "operator", "technician"] },
  { to: "/billing", label: "Billing", icon: "💳", roles: ["admin", "finance"] },
  { to: "/financial", label: "Financial Analytics", icon: "📈", roles: ["admin", "finance"] },
  { to: "/weather", label: "Analisis Cuaca", icon: "🌩️", roles: ["admin", "finance", "operator"] }
]

function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth()
  const userRole = user?.role || "admin"
  const navItems = allNavItems.filter(item => item.roles.includes(userRole))

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-56px)] flex-shrink-0 transform transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 lg:hidden">
          <span className="font-bold text-slate-800">Menu</span>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">&times;</button>
        </div>
        <nav className="p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
