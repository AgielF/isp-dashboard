import { NavLink } from "react-router-dom"

const navItems = [
  { to: "/", label: "Dashboard", icon: "📊" },
  { to: "/routers", label: "Router", icon: "📡" },
  { to: "/clients", label: "Pelanggan", icon: "👥" },
  { to: "/installations", label: "Pemasangan Baru", icon: "🔌" },
  { to: "/maintenance", label: "Maintenance", icon: "🔧" },
  { to: "/billing", label: "Billing", icon: "💳" },
  { to: "/financial", label: "Financial Analytics", icon: "📈" }
]

function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-60px)] flex-shrink-0">
      <nav className="p-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
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
  )
}

export default Sidebar
