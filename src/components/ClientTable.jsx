import { useState, useEffect } from "react"
import { fetchClients } from "../services/api"

function ClientTable() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClients()
      .then(setClients)
      .catch(err => console.error("Gagal memuat client:", err))
      .finally(() => setLoading(false))
  }, [])

  const getStatusBadge = (status) => {
    if (status === "active") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
          Active
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
        Suspended
      </span>
    )
  }

  const getPingColor = (ping) => {
    if (ping === 0) return "text-slate-400"
    if (ping <= 5) return "text-emerald-600"
    if (ping <= 10) return "text-amber-600"
    return "text-red-600"
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
        <div className="text-slate-400 animate-pulse text-sm">Memuat pelanggan...</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800">Daftar Pelanggan</h2>
        <span className="text-xs text-slate-400">{clients.length} pelanggan terdaftar</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase">
              <th className="text-left px-5 py-3 font-medium">Pelanggan</th>
              <th className="text-left px-5 py-3 font-medium">Plan</th>
              <th className="text-left px-5 py-3 font-medium">IP</th>
              <th className="text-left px-5 py-3 font-medium">Router</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-right px-5 py-3 font-medium">Bandwidth</th>
              <th className="text-right px-5 py-3 font-medium">Ping</th>
              <th className="text-left px-5 py-3 font-medium">Kontrak Akhir</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3 font-medium text-slate-800">{client.name}</td>
                <td className="px-5 py-3">
                  <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-md">{client.plan}</span>
                </td>
                <td className="px-5 py-3 font-mono text-xs text-slate-500">{client.ip}</td>
                <td className="px-5 py-3 text-xs text-slate-600">{client.router}</td>
                <td className="px-5 py-3">{getStatusBadge(client.status)}</td>
                <td className="px-5 py-3 text-right text-xs text-slate-600">{client.bandwidth} Mbps</td>
                <td className={`px-5 py-3 text-right text-xs font-medium ${getPingColor(client.ping)}`}>
                  {client.ping > 0 ? `${client.ping} ms` : "-"}
                </td>
                <td className="px-5 py-3 text-xs text-slate-500">
                  {client.contractEnd ? new Date(client.contractEnd).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ClientTable
