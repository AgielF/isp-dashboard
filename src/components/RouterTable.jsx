import { useState, useEffect } from "react"
import { fetchRouters } from "../services/api"

function RouterTable() {
  const [routers, setRouters] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    fetchRouters()
      .then(setRouters)
      .catch(err => console.error("Gagal memuat router:", err))
      .finally(() => setLoading(false))
  }, [])

  const filtered = routers.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.location.toLowerCase().includes(search.toLowerCase()) ||
      r.ip.includes(search)
    const matchStatus = statusFilter === "all" || r.status === statusFilter
    return matchSearch && matchStatus
  })

  const getStatusBadge = (status) => {
    if (status === "online") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
          Online
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
        <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
        Offline
      </span>
    )
  }

  const getCpuBar = (cpu) => {
    let color = "bg-emerald-500"
    if (cpu > 70) color = "bg-red-500"
    else if (cpu > 40) color = "bg-amber-500"

    return (
      <div className="flex items-center gap-2">
        <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${color}`} style={{ width: `${cpu}%` }}></div>
        </div>
        <span className="text-xs text-slate-600">{cpu}%</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
        <div className="text-slate-400 animate-pulse text-sm">Memuat router...</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h2 className="text-lg font-bold text-slate-800">Status Router</h2>
          <span className="text-xs text-slate-400">{filtered.length} / {routers.length} router</span>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <input
            type="text" placeholder="Cari router..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none flex-1"
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
            <option value="all">Semua</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase">
              <th className="text-left px-5 py-3 font-medium">Router</th>
              <th className="text-left px-5 py-3 font-medium hidden sm:table-cell">Lokasi</th>
              <th className="text-left px-5 py-3 font-medium">IP Address</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-left px-5 py-3 font-medium hidden md:table-cell">CPU</th>
              <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Memory</th>
              <th className="text-right px-5 py-3 font-medium hidden lg:table-cell">Traffic In/Out</th>
              <th className="text-left px-5 py-3 font-medium hidden lg:table-cell">Uptime</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((router) => (
              <tr key={router.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3 font-medium text-slate-800">{router.name}</td>
                <td className="px-5 py-3 text-slate-600 hidden sm:table-cell">{router.location}</td>
                <td className="px-5 py-3 font-mono text-xs text-slate-500">{router.ip}</td>
                <td className="px-5 py-3">{getStatusBadge(router.status)}</td>
                <td className="px-5 py-3 hidden md:table-cell">{getCpuBar(router.cpu)}</td>
                <td className="px-5 py-3 hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-blue-500" style={{ width: `${router.memory}%` }}></div>
                    </div>
                    <span className="text-xs text-slate-600">{router.memory}%</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-right text-xs text-slate-600 hidden lg:table-cell">
                  {router.trafficIn.toFixed(2)} / {router.trafficOut.toFixed(2)} Gbps
                </td>
                <td className="px-5 py-3 text-xs text-slate-500 hidden lg:table-cell">{router.uptime}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="px-5 py-8 text-center text-slate-400 text-sm">Tidak ada router ditemukan</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RouterTable
