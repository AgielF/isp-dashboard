import { useState, useEffect } from "react"
import Modal from "../components/Modal"
import StatCard from "../components/StatCard"
import { fetchRouters, createRouter, updateRouter, deleteRouter } from "../services/api"
import { exportPDF, exportExcel, getExportFilename } from "../utils/exportUtils"
import { useCan } from "../hooks/useCan"

const emptyForm = { name: "", location: "", ip: "", status: "online", cpu: 0, memory: 0, uptime: "0d 0h 0m", trafficIn: 0, trafficOut: 0 }

function RoutersPage() {
  const { can } = useCan()
  const [routers, setRouters] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const load = async () => {
    try {
      const data = await fetchRouters()
      setRouters(data)
    } catch (err) {
      console.error("Gagal memuat router:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = routers.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.location.toLowerCase().includes(search.toLowerCase()) ||
      r.ip.includes(search)
    const matchStatus = statusFilter === "all" || r.status === statusFilter
    return matchSearch && matchStatus
  })

  const openAdd = () => { setEditingId(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (r) => {
    setEditingId(r.id)
    setForm({
      name: r.name, location: r.location, ip: r.ip, status: r.status,
      cpu: r.cpu, memory: r.memory, uptime: r.uptime,
      trafficIn: r.trafficIn, trafficOut: r.trafficOut,
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingId) {
        await updateRouter(editingId, form)
      } else {
        await createRouter(form)
      }
      setModalOpen(false)
      load()
    } catch (err) {
      console.error("Gagal menyimpan:", err)
      alert("Gagal menyimpan data router")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteRouter(deleteId)
      setDeleteId(null)
      load()
    } catch (err) {
      console.error("Gagal menghapus:", err)
      alert("Gagal menghapus router")
    }
  }

  const getStatusBadge = (status) => {
    if (status === "online") {
      return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>Online</span>
    }
    return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700"><span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>Offline</span>
  }

  const getCpuBar = (val) => {
    let color = "bg-emerald-500"
    if (val > 70) color = "bg-red-500"
    else if (val > 40) color = "bg-amber-500"
    return (
      <div className="flex items-center gap-2">
        <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${color}`} style={{ width: `${val}%` }}></div>
        </div>
        <span className="text-xs text-slate-600">{val}%</span>
      </div>
    )
  }

  const onlineCount = routers.filter(r => r.status === "online").length
  const offlineCount = routers.filter(r => r.status === "offline").length

  const handleExportPDF = () => {
    const headers = ["Router", "Lokasi", "IP Address", "Status", "CPU (%)", "Memory (%)", "Traffic In (Gbps)", "Traffic Out (Gbps)", "Uptime"]
    const rows = filtered.map(r => [r.name, r.location, r.ip, r.status, r.cpu, r.memory, r.trafficIn.toFixed(2), r.trafficOut.toFixed(2), r.uptime])
    exportPDF("Daftar Router", "ISP Monitoring Dashboard", headers, rows, getExportFilename("router"))
  }

  const handleExportExcel = () => {
    const headers = ["Router", "Lokasi", "IP Address", "Status", "CPU (%)", "Memory (%)", "Traffic In (Gbps)", "Traffic Out (Gbps)", "Uptime"]
    const rows = filtered.map(r => [r.name, r.location, r.ip, r.status, r.cpu, r.memory, r.trafficIn, r.trafficOut, r.uptime])
    exportExcel("Router", headers, rows, getExportFilename("router"))
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-slate-400 animate-pulse">Memuat data...</div></div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Manajemen Router</h1>
        <p className="text-sm text-slate-500 mt-1">Kelola dan monitoring perangkat router jaringan</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Router" value={routers.length} icon="📡" color="blue" />
        <StatCard title="Online" value={onlineCount} icon="✅" color="green" />
        <StatCard title="Offline" value={offlineCount} icon="⚠" color="red" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
            <input
              type="text" placeholder="Cari router..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none flex-1"
            />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
              <option value="all">Semua Status</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative group">
              <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap">
                Export
              </button>
              <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-10 hidden group-hover:block min-w-[120px]">
                <button onClick={handleExportPDF} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Export PDF</button>
                <button onClick={handleExportExcel} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Export Excel</button>
              </div>
            </div>
            {can("routers", "create") && (
              <button onClick={openAdd}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap">
                + Tambah Router
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase">
                <th className="text-left px-5 py-3 font-medium">Router</th>
                <th className="text-left px-5 py-3 font-medium">Lokasi</th>
                <th className="text-left px-5 py-3 font-medium">IP Address</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">CPU</th>
                <th className="text-left px-5 py-3 font-medium">Memory</th>
                <th className="text-right px-5 py-3 font-medium">Traffic In/Out</th>
                <th className="text-left px-5 py-3 font-medium">Uptime</th>
                <th className="text-center px-5 py-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((router) => (
                <tr key={router.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-slate-800">{router.name}</td>
                  <td className="px-5 py-3 text-slate-600">{router.location}</td>
                  <td className="px-5 py-3 font-mono text-xs text-slate-500">{router.ip}</td>
                  <td className="px-5 py-3">{getStatusBadge(router.status)}</td>
                  <td className="px-5 py-3">{getCpuBar(router.cpu)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-blue-500" style={{ width: `${router.memory}%` }}></div>
                      </div>
                      <span className="text-xs text-slate-600">{router.memory}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right text-xs text-slate-600">
                    {router.trafficIn.toFixed(2)} / {router.trafficOut.toFixed(2)} Gbps
                  </td>
                  <td className="px-5 py-3 text-xs text-slate-500">{router.uptime}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-center gap-1">
                      {can("routers", "update") && (
                        <button onClick={() => openEdit(router)}
                          className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 rounded hover:bg-blue-50 transition-colors">
                          Edit
                        </button>
                      )}
                      {can("routers", "delete") && (
                        <button onClick={() => setDeleteId(router.id)}
                          className="text-red-600 hover:text-red-800 text-xs px-2 py-1 rounded hover:bg-red-50 transition-colors">
                          Hapus
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="px-5 py-8 text-center text-slate-400 text-sm">Tidak ada data router ditemukan</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Router" : "Tambah Router"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama Router *</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Router-01" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Lokasi *</label>
              <input type="text" required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Kantor Pusat" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">IP Address *</label>
              <input type="text" required value={form.ip} onChange={(e) => setForm({ ...form, ip: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="192.168.1.1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">CPU (%)</label>
              <input type="number" min="0" max="100" value={form.cpu} onChange={(e) => setForm({ ...form, cpu: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Memory (%)</label>
              <input type="number" min="0" max="100" value={form.memory} onChange={(e) => setForm({ ...form, memory: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Uptime</label>
            <input type="text" value={form.uptime} onChange={(e) => setForm({ ...form, uptime: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="15d 8h 30m" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Traffic In (Gbps)</label>
              <input type="number" step="0.01" min="0" value={form.trafficIn} onChange={(e) => setForm({ ...form, trafficIn: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Traffic Out (Gbps)</label>
              <input type="number" step="0.01" min="0" value={form.trafficOut} onChange={(e) => setForm({ ...form, trafficOut: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              Batal
            </button>
            <button type="submit" disabled={saving}
              className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50">
              {saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Tambah Router"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Konfirmasi Hapus">
        <p className="text-sm text-slate-600 mb-4">Apakah Anda yakin ingin menghapus router ini? Tindakan ini tidak dapat dibatalkan.</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDeleteId(null)}
            className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            Batal
          </button>
          <button onClick={handleDelete}
            className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors">
            Hapus
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default RoutersPage
