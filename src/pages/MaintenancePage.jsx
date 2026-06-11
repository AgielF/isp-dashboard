import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import Modal from "../components/Modal"
import StatCard from "../components/StatCard"
import { fetchSMYOverview, fetchSiteSummary, fetchMonthlyData, fetchMaintenanceLogs, createMaintenance, updateMaintenance, deleteMaintenance } from "../services/api"
import { exportPDF, exportExcel, getExportFilename } from "../utils/exportUtils"
import { useCan } from "../hooks/useCan"

const emptyForm = { routerName: "", type: "preventive", description: "", technician: "", status: "scheduled", startDate: "", endDate: "", duration: "" }

function MaintenancePage() {
  const { can } = useCan()
  const [stats, setStats] = useState(null)
  const [siteCumulative, setSiteCumulative] = useState([])
  const [siteCurrent, setSiteCurrent] = useState([])
  const [monthlyMT, setMonthlyMT] = useState([])
  const [logs, setLogs] = useState([])
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
      const [overview, sites, monthly, logData] = await Promise.all([
        fetchSMYOverview(), fetchSiteSummary(), fetchMonthlyData("mt"), fetchMaintenanceLogs(),
      ])
      setStats(overview)
      setSiteCumulative(sites)
      setSiteCurrent(sites)
      setMonthlyMT(monthly)
      setLogs(logData)
    } catch (err) {
      console.error("Gagal memuat data MT:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = logs.filter(l => {
    const matchSearch = l.routerName?.toLowerCase().includes(search.toLowerCase()) ||
      l.description?.toLowerCase().includes(search.toLowerCase()) ||
      l.technician?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "all" || l.status === statusFilter
    return matchSearch && matchStatus
  })

  const openAdd = () => { setEditingId(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (l) => {
    setEditingId(l.id)
    setForm({
      routerName: l.routerName || "", type: l.type || "preventive", description: l.description || "",
      technician: l.technician || "", status: l.status || "scheduled",
      startDate: l.startDate ? l.startDate.split("T")[0] : "",
      endDate: l.endDate ? l.endDate.split("T")[0] : "",
      duration: l.duration || "",
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingId) { await updateMaintenance(editingId, form) }
      else { await createMaintenance(form) }
      setModalOpen(false)
      load()
    } catch (err) {
      console.error("Gagal menyimpan:", err)
      alert("Gagal menyimpan data maintenance")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteMaintenance(deleteId)
      setDeleteId(null)
      load()
    } catch (err) {
      console.error("Gagal menghapus:", err)
      alert("Gagal menghapus log maintenance")
    }
  }

  const getStatusBadge = (status) => {
    const map = {
      scheduled: { bg: "bg-blue-100 text-blue-700", dot: "bg-blue-500", label: "Terjadwal" },
      in_progress: { bg: "bg-cyan-100 text-cyan-700", dot: "bg-cyan-500", label: "Proses" },
      completed: { bg: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500", label: "Selesai" },
      cancelled: { bg: "bg-red-100 text-red-700", dot: "bg-red-500", label: "Dibatalkan" },
    }
    const s = map[status] || map.scheduled
    return <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${s.bg}`}><span className={`w-1.5 h-1.5 ${s.dot} rounded-full`}></span>{s.label}</span>
  }

  const getTypeBadge = (type) => {
    const map = {
      preventive: { bg: "bg-purple-100 text-purple-700", label: "Preventif" },
      corrective: { bg: "bg-orange-100 text-orange-700", label: "Korektif" },
      emergency: { bg: "bg-red-100 text-red-700", label: "Darurat" },
    }
    const t = map[type] || map.preventive
    return <span className={`text-xs px-2 py-1 rounded-md ${t.bg}`}>{t.label}</span>
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-slate-400 animate-pulse">Memuat data...</div></div>
  }

  const totalMT = stats?.maintenance || 0
  const dismantleBill = stats?.dismantleBill || 0
  const totalCurrentMT = siteCurrent.reduce((s, r) => s + (r.mtCurrentMonth || 0), 0)
  const totalCumulativeMT = siteCumulative.reduce((s, r) => s + r.mt, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Maintenance</h1>
        <p className="text-sm text-slate-500 mt-1">Data pemeliharaan SMY.ID — {stats?.bulan} {stats?.tahun}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Maintenance" value={totalMT} icon="🔧" color="blue" subtitle="Kumulatif keseluruhan" />
        <StatCard title="MT Bulan Ini" value={totalCurrentMT} icon="📌" color="green" subtitle={`${stats?.bulan} ${stats?.tahun}`} />
        <StatCard title="MT Kumulatif Site" value={totalCumulativeMT} icon="🏗" color="cyan" subtitle="Semua site" />
        <StatCard title="Dismantle-Bill" value={dismantleBill} icon="📦" color="red" subtitle="Penggunaan material" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800">Kumulatif per Site</h2>
            <p className="text-xs text-slate-400">Total maintenance sepanjang masa</p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase">
                <th className="text-left px-5 py-3 font-medium">Site</th>
                <th className="text-right px-5 py-3 font-medium">PSB</th>
                <th className="text-right px-5 py-3 font-medium">Maintenance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {siteCumulative.map((row) => (
                <tr key={row.site} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 font-bold text-slate-800">{row.site}</td>
                  <td className="px-5 py-3 text-right text-slate-500">{row.psb.toLocaleString("id-ID")}</td>
                  <td className="px-5 py-3 text-right font-semibold text-amber-700">{row.mt.toLocaleString("id-ID")}</td>
                </tr>
              ))}
              <tr className="bg-slate-50 font-bold">
                <td className="px-5 py-3 text-slate-800">Total</td>
                <td className="px-5 py-3 text-right text-slate-500">{siteCumulative.reduce((s, r) => s + r.psb, 0).toLocaleString("id-ID")}</td>
                <td className="px-5 py-3 text-right text-amber-700">{siteCumulative.reduce((s, r) => s + r.mt, 0).toLocaleString("id-ID")}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800">Bulan Berjalan</h2>
            <p className="text-xs text-slate-400">{stats?.bulan} {stats?.tahun}</p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase">
                <th className="text-left px-5 py-3 font-medium">Site</th>
                <th className="text-right px-5 py-3 font-medium">PSB</th>
                <th className="text-right px-5 py-3 font-medium">Maintenance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {siteCurrent.map((row) => (
                <tr key={row.site} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 font-bold text-slate-800">{row.site}</td>
                  <td className="px-5 py-3 text-right text-slate-500">{row.psbCurrentMonth}</td>
                  <td className="px-5 py-3 text-right font-semibold text-amber-700">{row.mtCurrentMonth}</td>
                </tr>
              ))}
              <tr className="bg-slate-50 font-bold">
                <td className="px-5 py-3 text-slate-800">Total</td>
                <td className="px-5 py-3 text-right text-slate-500">{siteCurrent.reduce((s, r) => s + (r.psbCurrentMonth || 0), 0)}</td>
                <td className="px-5 py-3 text-right text-amber-700">{siteCurrent.reduce((s, r) => s + (r.mtCurrentMonth || 0), 0)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-800">Maintenance Bulanan {stats?.tahun}</h2>
          <p className="text-xs text-slate-400">Perbandingan per site tiap bulan</p>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyMT} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="bulan" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey="knc" name="KNC" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="rpm" name="RPM" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="ptk" name="PTK" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <hr className="border-slate-200" />

      {/* Maintenance Logs Table with CRUD */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
            <input type="text" placeholder="Cari maintenance..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none flex-1" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
              <option value="all">Semua Status</option>
              <option value="scheduled">Terjadwal</option>
              <option value="in_progress">Proses</option>
              <option value="completed">Selesai</option>
              <option value="cancelled">Dibatalkan</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative group">
              <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap">
                Export
              </button>
              <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-10 hidden group-hover:block min-w-[120px]">
                <button onClick={() => {
                  const headers = ["Router", "Tipe", "Deskripsi", "Teknisi", "Status", "Mulai", "Durasi"]
                  const typeLabels = { preventive: "Preventif", corrective: "Korektif", emergency: "Darurat" }
                  const statusLabels = { scheduled: "Terjadwal", in_progress: "Proses", completed: "Selesai", cancelled: "Dibatalkan" }
                  const rows = filtered.map(l => [l.routerName || "-", typeLabels[l.type] || l.type, l.description || "-", l.technician || "-", statusLabels[l.status] || l.status, l.startDate ? new Date(l.startDate).toLocaleDateString("id-ID") : "-", l.duration || "-"])
                  exportPDF("Daftar Maintenance", "ISP Monitoring Dashboard", headers, rows, getExportFilename("maintenance"))
                }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Export PDF</button>
                <button onClick={() => {
                  const headers = ["Router", "Tipe", "Deskripsi", "Teknisi", "Status", "Mulai", "Durasi"]
                  const rows = filtered.map(l => [l.routerName || "-", l.type, l.description || "-", l.technician || "-", l.status, l.startDate ? new Date(l.startDate).toLocaleDateString("id-ID") : "-", l.duration || "-"])
                  exportExcel("Maintenance", headers, rows, getExportFilename("maintenance"))
                }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Export Excel</button>
              </div>
            </div>
            {can("maintenance", "create") && (
              <button onClick={openAdd}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap">
                + Tambah Maintenance
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase">
                <th className="text-left px-5 py-3 font-medium">Router</th>
                <th className="text-left px-5 py-3 font-medium">Tipe</th>
                <th className="text-left px-5 py-3 font-medium">Deskripsi</th>
                <th className="text-left px-5 py-3 font-medium">Teknisi</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Mulai</th>
                <th className="text-left px-5 py-3 font-medium">Durasi</th>
                <th className="text-center px-5 py-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-slate-800">{log.routerName || "-"}</td>
                  <td className="px-5 py-3">{getTypeBadge(log.type)}</td>
                  <td className="px-5 py-3 text-slate-600 max-w-[200px] truncate">{log.description || "-"}</td>
                  <td className="px-5 py-3 text-xs text-slate-600">{log.technician || "-"}</td>
                  <td className="px-5 py-3">{getStatusBadge(log.status)}</td>
                  <td className="px-5 py-3 text-xs text-slate-500">
                    {log.startDate ? new Date(log.startDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-"}
                  </td>
                  <td className="px-5 py-3 text-xs text-slate-500">{log.duration || "-"}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-center gap-1">
                      {can("maintenance", "update") && (
                        <button onClick={() => openEdit(log)} className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 rounded hover:bg-blue-50 transition-colors">Edit</button>
                      )}
                      {can("maintenance", "delete") && (
                        <button onClick={() => setDeleteId(log.id)} className="text-red-600 hover:text-red-800 text-xs px-2 py-1 rounded hover:bg-red-50 transition-colors">Hapus</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-5 py-8 text-center text-slate-400 text-sm">Tidak ada data maintenance ditemukan</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Maintenance" : "Tambah Maintenance"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Router *</label>
              <input type="text" required value={form.routerName} onChange={(e) => setForm({ ...form, routerName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Router-01" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tipe</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                <option value="preventive">Preventif</option>
                <option value="corrective">Korektif</option>
                <option value="emergency">Darurat</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Teknisi</label>
              <input type="text" value={form.technician} onChange={(e) => setForm({ ...form, technician: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                <option value="scheduled">Terjadwal</option>
                <option value="in_progress">Proses</option>
                <option value="completed">Selesai</option>
                <option value="cancelled">Dibatalkan</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Mulai</label>
              <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Selesai</label>
              <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Durasi</label>
            <input type="text" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="2 jam" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Batal</button>
            <button type="submit" disabled={saving}
              className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50">
              {saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Tambah Maintenance"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Konfirmasi Hapus">
        <p className="text-sm text-slate-600 mb-4">Apakah Anda yakin ingin menghapus log maintenance ini? Tindakan ini tidak dapat dibatalkan.</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDeleteId(null)}
            className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Batal</button>
          <button onClick={handleDelete}
            className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors">Hapus</button>
        </div>
      </Modal>
    </div>
  )
}

export default MaintenancePage
