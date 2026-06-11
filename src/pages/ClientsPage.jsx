import { useState, useEffect } from "react"
import Modal from "../components/Modal"
import StatCard from "../components/StatCard"
import { fetchClients, fetchRouters, createClient, updateClient, deleteClient } from "../services/api"
import { exportPDF, exportExcel, getExportFilename } from "../utils/exportUtils"

const emptyForm = { name: "", plan: "", ip: "", routerName: "", status: "active", bandwidth: 0, ping: 0, contractEnd: "" }

function ClientsPage() {
  const [clients, setClients] = useState([])
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
      const [clientData, routerData] = await Promise.all([fetchClients(), fetchRouters()])
      setClients(clientData)
      setRouters(routerData)
    } catch (err) {
      console.error("Gagal memuat data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = clients.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.ip.includes(search) || c.plan.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "all" || c.status === statusFilter
    return matchSearch && matchStatus
  })

  const openAdd = () => { setEditingId(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (c) => {
    setEditingId(c.id)
    setForm({
      name: c.name, plan: c.plan, ip: c.ip, routerName: c.router || "",
      status: c.status, bandwidth: c.bandwidth, ping: c.ping,
      contractEnd: c.contractEnd ? c.contractEnd.split("T")[0] : "",
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingId) {
        await updateClient(editingId, form)
      } else {
        await createClient(form)
      }
      setModalOpen(false)
      load()
    } catch (err) {
      console.error("Gagal menyimpan:", err)
      alert("Gagal menyimpan data pelanggan")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteClient(deleteId)
      setDeleteId(null)
      load()
    } catch (err) {
      console.error("Gagal menghapus:", err)
      alert("Gagal menghapus pelanggan")
    }
  }

  const getStatusBadge = (status) => {
    if (status === "active") {
      return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>Aktif</span>
    }
    return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700"><span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>Suspend</span>
  }

  const getPingColor = (ping) => {
    if (ping === 0) return "text-slate-400"
    if (ping <= 5) return "text-emerald-600"
    if (ping <= 10) return "text-amber-600"
    return "text-red-600"
  }

  const activeCount = clients.filter(c => c.status === "active").length
  const suspendedCount = clients.filter(c => c.status !== "active").length

  const handleExportPDF = () => {
    const headers = ["Pelanggan", "Plan", "IP", "Router", "Status", "Bandwidth (Mbps)", "Ping (ms)", "Kontrak Akhir"]
    const rows = filtered.map(c => [c.name, c.plan, c.ip, c.router, c.status, c.bandwidth, c.ping, c.contractEnd ? new Date(c.contractEnd).toLocaleDateString("id-ID") : "-"])
    exportPDF("Daftar Pelanggan", "ISP Monitoring Dashboard", headers, rows, getExportFilename("pelanggan"))
  }

  const handleExportExcel = () => {
    const headers = ["Pelanggan", "Plan", "IP", "Router", "Status", "Bandwidth (Mbps)", "Ping (ms)", "Kontrak Akhir"]
    const rows = filtered.map(c => [c.name, c.plan, c.ip, c.router, c.status, c.bandwidth, c.ping, c.contractEnd ? new Date(c.contractEnd).toLocaleDateString("id-ID") : "-"])
    exportExcel("Pelanggan", headers, rows, getExportFilename("pelanggan"))
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-slate-400 animate-pulse">Memuat data...</div></div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Manajemen Pelanggan</h1>
        <p className="text-sm text-slate-500 mt-1">Kelola data pelanggan ISP</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Pelanggan" value={clients.length} icon="👥" color="blue" />
        <StatCard title="Aktif" value={activeCount} icon="✅" color="green" />
        <StatCard title="Suspend" value={suspendedCount} icon="⏸" color="yellow" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
            <input
              type="text" placeholder="Cari pelanggan..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none flex-1"
            />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="suspended">Suspend</option>
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
            <button onClick={openAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap">
              + Tambah Pelanggan
            </button>
          </div>
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
                <th className="text-center px-5 py-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((client) => (
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
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => openEdit(client)}
                        className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 rounded hover:bg-blue-50 transition-colors">
                        Edit
                      </button>
                      <button onClick={() => setDeleteId(client.id)}
                        className="text-red-600 hover:text-red-800 text-xs px-2 py-1 rounded hover:bg-red-50 transition-colors">
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="px-5 py-8 text-center text-slate-400 text-sm">Tidak ada data pelanggan ditemukan</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Pelanggan" : "Tambah Pelanggan"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Pelanggan *</label>
            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Nama pelanggan" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Paket / Plan *</label>
              <input type="text" required value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="50 Mbps" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">IP Address *</label>
              <input type="text" required value={form.ip} onChange={(e) => setForm({ ...form, ip: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="10.0.0.1" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Router</label>
              <select value={form.routerName} onChange={(e) => setForm({ ...form, routerName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                <option value="">-- Pilih Router --</option>
                {routers.map(r => <option key={r.id} value={r.name}>{r.name} ({r.location})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                <option value="active">Aktif</option>
                <option value="suspended">Suspend</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Bandwidth (Mbps)</label>
              <input type="number" min="0" value={form.bandwidth} onChange={(e) => setForm({ ...form, bandwidth: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ping (ms)</label>
              <input type="number" min="0" value={form.ping} onChange={(e) => setForm({ ...form, ping: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Akhir Kontrak</label>
            <input type="date" value={form.contractEnd} onChange={(e) => setForm({ ...form, contractEnd: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              Batal
            </button>
            <button type="submit" disabled={saving}
              className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50">
              {saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Tambah Pelanggan"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Konfirmasi Hapus">
        <p className="text-sm text-slate-600 mb-4">Apakah Anda yakin ingin menghapus pelanggan ini? Tindakan ini tidak dapat dibatalkan.</p>
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

export default ClientsPage
