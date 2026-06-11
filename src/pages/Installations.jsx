import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import Modal from "../components/Modal"
import StatCard from "../components/StatCard"
import { fetchSMYOverview, fetchSiteSummary, fetchMonthlyData, fetchInstallations, createInstallation, updateInstallation, deleteInstallation } from "../services/api"
import { exportPDF, exportExcel, getExportFilename } from "../utils/exportUtils"

const emptyForm = { clientName: "", address: "", plan: "", technician: "", status: "pending", scheduledDate: "", completedDate: "", notes: "" }

function Installations() {
  const [stats, setStats] = useState(null)
  const [siteCumulative, setSiteCumulative] = useState([])
  const [siteCurrent, setSiteCurrent] = useState([])
  const [monthlyPSB, setMonthlyPSB] = useState([])
  const [installations, setInstallations] = useState([])
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
      const [overview, sites, monthly, instData] = await Promise.all([
        fetchSMYOverview(), fetchSiteSummary(), fetchMonthlyData("psb"), fetchInstallations(),
      ])
      setStats(overview)
      setSiteCumulative(sites)
      setSiteCurrent(sites)
      setMonthlyPSB(monthly)
      setInstallations(instData)
    } catch (err) {
      console.error("Gagal memuat data PSB:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = installations.filter(i => {
    const matchSearch = i.clientName.toLowerCase().includes(search.toLowerCase()) ||
      i.address?.toLowerCase().includes(search.toLowerCase()) ||
      i.technician?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "all" || i.status === statusFilter
    return matchSearch && matchStatus
  })

  const openAdd = () => { setEditingId(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (i) => {
    setEditingId(i.id)
    setForm({
      clientName: i.clientName, address: i.address || "", plan: i.plan || "",
      technician: i.technician || "", status: i.status,
      scheduledDate: i.scheduledDate ? i.scheduledDate.split("T")[0] : "",
      completedDate: i.completedDate ? i.completedDate.split("T")[0] : "",
      notes: i.notes || "",
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingId) { await updateInstallation(editingId, form) }
      else { await createInstallation(form) }
      setModalOpen(false)
      load()
    } catch (err) {
      console.error("Gagal menyimpan:", err)
      alert("Gagal menyimpan data instalasi")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteInstallation(deleteId)
      setDeleteId(null)
      load()
    } catch (err) {
      console.error("Gagal menghapus:", err)
      alert("Gagal menghapus instalasi")
    }
  }

  const getStatusBadge = (status) => {
    const map = {
      pending: { bg: "bg-amber-100 text-amber-700", dot: "bg-amber-500", label: "Pending" },
      scheduled: { bg: "bg-blue-100 text-blue-700", dot: "bg-blue-500", label: "Terjadwal" },
      in_progress: { bg: "bg-cyan-100 text-cyan-700", dot: "bg-cyan-500", label: "Proses" },
      completed: { bg: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500", label: "Selesai" },
      cancelled: { bg: "bg-red-100 text-red-700", dot: "bg-red-500", label: "Dibatalkan" },
    }
    const s = map[status] || map.pending
    return <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${s.bg}`}><span className={`w-1.5 h-1.5 ${s.dot} rounded-full`}></span>{s.label}</span>
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-slate-400 animate-pulse">Memuat data...</div></div>
  }

  const totalPSB = stats?.psb || 0
  const totalPembangunan = stats?.pembangunan || 0
  const totalCurrentPSB = siteCurrent.reduce((s, r) => s + (r.psbCurrentMonth || 0), 0)
  const totalCumulativePSB = siteCumulative.reduce((s, r) => s + r.psb, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Pemasangan Baru (PSB)</h1>
        <p className="text-sm text-slate-500 mt-1">Data pemasangan baru SMY.ID — {stats?.bulan} {stats?.tahun}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total PSB" value={totalPSB} icon="📋" color="blue" subtitle="Kumulatif keseluruhan" />
        <StatCard title="PSB Bulan Ini" value={totalCurrentPSB} icon="📌" color="green" subtitle={`${stats?.bulan} ${stats?.tahun}`} />
        <StatCard title="PSB Kumulatif Site" value={totalCumulativePSB} icon="🏗" color="cyan" subtitle="Semua site" />
        <StatCard title="Pembangunan" value={totalPembangunan} icon="🏢" color="purple" subtitle="Total keseluruhan" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800">Kumulatif per Site</h2>
            <p className="text-xs text-slate-400">Total pemasangan sepanjang masa</p>
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
                  <td className="px-5 py-3 text-right font-semibold text-blue-700">{row.psb.toLocaleString("id-ID")}</td>
                  <td className="px-5 py-3 text-right text-slate-600">{row.mt.toLocaleString("id-ID")}</td>
                </tr>
              ))}
              <tr className="bg-slate-50 font-bold">
                <td className="px-5 py-3 text-slate-800">Total</td>
                <td className="px-5 py-3 text-right text-blue-700">{siteCumulative.reduce((s, r) => s + r.psb, 0).toLocaleString("id-ID")}</td>
                <td className="px-5 py-3 text-right text-slate-600">{siteCumulative.reduce((s, r) => s + r.mt, 0).toLocaleString("id-ID")}</td>
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
                  <td className="px-5 py-3 text-right font-semibold text-emerald-700">{row.psbCurrentMonth}</td>
                  <td className="px-5 py-3 text-right text-slate-600">{row.mtCurrentMonth}</td>
                </tr>
              ))}
              <tr className="bg-slate-50 font-bold">
                <td className="px-5 py-3 text-slate-800">Total</td>
                <td className="px-5 py-3 text-right text-emerald-700">{siteCurrent.reduce((s, r) => s + (r.psbCurrentMonth || 0), 0)}</td>
                <td className="px-5 py-3 text-right text-slate-600">{siteCurrent.reduce((s, r) => s + (r.mtCurrentMonth || 0), 0)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-800">PSB Bulanan {stats?.tahun}</h2>
          <p className="text-xs text-slate-400">Perbandingan per site tiap bulan</p>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyPSB} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="bulan" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey="knc" name="KNC" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="rpm" name="RPM" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="ptk" name="PTK" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <hr className="border-slate-200" />

      {/* Installation Data Table with CRUD */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
            <input type="text" placeholder="Cari instalasi..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none flex-1" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
              <option value="all">Semua Status</option>
              <option value="pending">Pending</option>
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
                  const headers = ["Pelanggan", "Alamat", "Paket", "Teknisi", "Status", "Jadwal"]
                  const statusLabels = { pending: "Pending", scheduled: "Terjadwal", in_progress: "Proses", completed: "Selesai", cancelled: "Dibatalkan" }
                  const rows = filtered.map(i => [i.clientName, i.address || "-", i.plan || "-", i.technician || "-", statusLabels[i.status] || i.status, i.scheduledDate ? new Date(i.scheduledDate).toLocaleDateString("id-ID") : "-"])
                  exportPDF("Daftar Instalasi", "ISP Monitoring Dashboard", headers, rows, getExportFilename("instalasi"))
                }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Export PDF</button>
                <button onClick={() => {
                  const headers = ["Pelanggan", "Alamat", "Paket", "Teknisi", "Status", "Jadwal"]
                  const rows = filtered.map(i => [i.clientName, i.address || "-", i.plan || "-", i.technician || "-", i.status, i.scheduledDate ? new Date(i.scheduledDate).toLocaleDateString("id-ID") : "-"])
                  exportExcel("Instalasi", headers, rows, getExportFilename("instalasi"))
                }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Export Excel</button>
              </div>
            </div>
            <button onClick={openAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap">
              + Tambah Instalasi
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase">
                <th className="text-left px-5 py-3 font-medium">Pelanggan</th>
                <th className="text-left px-5 py-3 font-medium">Alamat</th>
                <th className="text-left px-5 py-3 font-medium">Paket</th>
                <th className="text-left px-5 py-3 font-medium">Teknisi</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Jadwal</th>
                <th className="text-center px-5 py-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((inst) => (
                <tr key={inst.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-slate-800">{inst.clientName}</td>
                  <td className="px-5 py-3 text-slate-600 max-w-[200px] truncate">{inst.address || "-"}</td>
                  <td className="px-5 py-3"><span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-md">{inst.plan || "-"}</span></td>
                  <td className="px-5 py-3 text-xs text-slate-600">{inst.technician || "-"}</td>
                  <td className="px-5 py-3">{getStatusBadge(inst.status)}</td>
                  <td className="px-5 py-3 text-xs text-slate-500">
                    {inst.scheduledDate ? new Date(inst.scheduledDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-"}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => openEdit(inst)} className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 rounded hover:bg-blue-50 transition-colors">Edit</button>
                      <button onClick={() => setDeleteId(inst.id)} className="text-red-600 hover:text-red-800 text-xs px-2 py-1 rounded hover:bg-red-50 transition-colors">Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-8 text-center text-slate-400 text-sm">Tidak ada data instalasi ditemukan</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Instalasi" : "Tambah Instalasi"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama Pelanggan *</label>
              <input type="text" required value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Paket</label>
              <input type="text" value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="50 Mbps" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Alamat</label>
            <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
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
                <option value="pending">Pending</option>
                <option value="scheduled">Terjadwal</option>
                <option value="in_progress">Proses</option>
                <option value="completed">Selesai</option>
                <option value="cancelled">Dibatalkan</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Jadwal</label>
              <input type="date" value={form.scheduledDate} onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Selesai</label>
              <input type="date" value={form.completedDate} onChange={(e) => setForm({ ...form, completedDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Catatan</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Batal</button>
            <button type="submit" disabled={saving}
              className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50">
              {saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Tambah Instalasi"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Konfirmasi Hapus">
        <p className="text-sm text-slate-600 mb-4">Apakah Anda yakin ingin menghapus data instalasi ini? Tindakan ini tidak dapat dibatalkan.</p>
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

export default Installations
