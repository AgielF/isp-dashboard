import { useState, useEffect } from "react"
import Modal from "../components/Modal"
import StatCard from "../components/StatCard"
import { fetchInvoices, fetchBillingStats, createInvoice, updateInvoice, deleteInvoice } from "../services/api"
import { exportPDF, exportExcel, getExportFilename } from "../utils/exportUtils"
import { useCan } from "../hooks/useCan"

const emptyForm = { id: "", client: "", plan: "", amount: 0, status: "unpaid", issueDate: "", dueDate: "", paidDate: "", period: "" }

function Billing() {
  const { can } = useCan()
  const [invoices, setInvoices] = useState([])
  const [stats, setStats] = useState(null)
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
      const [invData, statData] = await Promise.all([fetchInvoices(), fetchBillingStats()])
      setInvoices(invData)
      setStats(statData)
    } catch (err) {
      console.error("Gagal memuat billing:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = invoices.filter(inv => {
    const matchSearch = inv.client.toLowerCase().includes(search.toLowerCase()) ||
      inv.id.toLowerCase().includes(search.toLowerCase()) ||
      inv.plan.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "all" || inv.status === statusFilter
    return matchSearch && matchStatus
  })

  const openAdd = () => {
    setEditingId(null)
    const today = new Date().toISOString().split("T")[0]
    const dueDate = new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0]
    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
    const now = new Date()
    setForm({ ...emptyForm, issueDate: today, dueDate, period: `${monthNames[now.getMonth()]} ${now.getFullYear()}` })
    setModalOpen(true)
  }

  const openEdit = (inv) => {
    setEditingId(inv.id)
    setForm({
      id: inv.id, client: inv.client, plan: inv.plan, amount: inv.amount, status: inv.status,
      issueDate: inv.issueDate ? inv.issueDate.split("T")[0] : "",
      dueDate: inv.dueDate ? inv.dueDate.split("T")[0] : "",
      paidDate: inv.paidDate ? inv.paidDate.split("T")[0] : "",
      period: inv.period || "",
    })
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingId) {
        await updateInvoice(editingId, form)
      } else {
        await createInvoice(form)
      }
      setModalOpen(false)
      load()
    } catch (err) {
      console.error("Gagal menyimpan:", err)
      alert("Gagal menyimpan invoice")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteInvoice(deleteId)
      setDeleteId(null)
      load()
    } catch (err) {
      console.error("Gagal menghapus:", err)
      alert("Gagal menghapus invoice")
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency", currency: "IDR",
      minimumFractionDigits: 0, maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusBadge = (status) => {
    if (status === "paid") {
      return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>Lunas</span>
    }
    if (status === "overdue") {
      return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700"><span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>Jatuh Tempo</span>
    }
    return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700"><span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>Belum Bayar</span>
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return "-"
    return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-slate-400 animate-pulse">Memuat data...</div></div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Billing</h1>
        <p className="text-sm text-slate-500 mt-1">Kelola tagihan dan pembayaran pelanggan</p>
      </div>

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Ditagihkan" value={formatCurrency(stats.totalInvoiced)} icon="📄" color="blue" subtitle={`${stats.totalInvoices} invoice`} />
          <StatCard title="Sudah Dibayar" value={formatCurrency(stats.totalPaid)} icon="✅" color="green" subtitle={`${stats.paidCount} invoice`} />
          <StatCard title="Belum Dibayar" value={formatCurrency(stats.totalUnpaid)} icon="⏳" color="yellow" subtitle={`${stats.unpaidCount} invoice`} />
          <StatCard title="Jatuh Tempo" value={formatCurrency(stats.totalOverdue)} icon="🚨" color="red" subtitle={`${stats.overdueCount} invoice`} />
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
            <input
              type="text" placeholder="Cari invoice..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none flex-1"
            />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
              <option value="all">Semua Status</option>
              <option value="paid">Lunas</option>
              <option value="unpaid">Belum Bayar</option>
              <option value="overdue">Jatuh Tempo</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative group">
              <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap">
                Export
              </button>
              <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-10 hidden group-hover:block min-w-[120px]">
                <button onClick={() => {
                  const headers = ["Invoice ID", "Pelanggan", "Plan", "Periode", "Jumlah (Rp)", "Status", "Jatuh Tempo", "Dibayar"]
                  const rows = filtered.map(i => [i.id, i.client, i.plan, i.period, formatCurrency(i.amount), i.status === "paid" ? "Lunas" : i.status === "overdue" ? "Jatuh Tempo" : "Belum Bayar", formatDate(i.dueDate), formatDate(i.paidDate)])
                  exportPDF("Daftar Invoice", "ISP Monitoring Dashboard", headers, rows, getExportFilename("invoice"))
                }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Export PDF</button>
                <button onClick={() => {
                  const headers = ["Invoice ID", "Pelanggan", "Plan", "Periode", "Jumlah (Rp)", "Status", "Jatuh Tempo", "Dibayar"]
                  const rows = filtered.map(i => [i.id, i.client, i.plan, i.period, i.amount, i.status, i.dueDate ? new Date(i.dueDate).toLocaleDateString("id-ID") : "-", i.paidDate ? new Date(i.paidDate).toLocaleDateString("id-ID") : "-"])
                  exportExcel("Invoice", headers, rows, getExportFilename("invoice"))
                }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Export Excel</button>
              </div>
            </div>
            {can("billing", "create") && (
              <button onClick={openAdd}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap">
                + Tambah Invoice
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase">
                <th className="text-left px-5 py-3 font-medium">Invoice ID</th>
                <th className="text-left px-5 py-3 font-medium">Pelanggan</th>
                <th className="text-left px-5 py-3 font-medium">Plan</th>
                <th className="text-left px-5 py-3 font-medium">Periode</th>
                <th className="text-right px-5 py-3 font-medium">Jumlah</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Jatuh Tempo</th>
                <th className="text-left px-5 py-3 font-medium">Dibayar</th>
                <th className="text-center px-5 py-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-slate-600">{inv.id}</td>
                  <td className="px-5 py-3 font-medium text-slate-800">{inv.client}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-md">{inv.plan}</span>
                  </td>
                  <td className="px-5 py-3 text-xs text-slate-600">{inv.period}</td>
                  <td className="px-5 py-3 text-right font-medium text-slate-800">{formatCurrency(inv.amount)}</td>
                  <td className="px-5 py-3">{getStatusBadge(inv.status)}</td>
                  <td className="px-5 py-3 text-xs text-slate-500">{formatDate(inv.dueDate)}</td>
                  <td className="px-5 py-3 text-xs text-slate-500">{formatDate(inv.paidDate)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-center gap-1">
                      {can("billing", "update") && (
                        <button onClick={() => openEdit(inv)}
                          className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 rounded hover:bg-blue-50 transition-colors">
                          Edit
                        </button>
                      )}
                      {can("billing", "delete") && (
                        <button onClick={() => setDeleteId(inv.id)}
                          className="text-red-600 hover:text-red-800 text-xs px-2 py-1 rounded hover:bg-red-50 transition-colors">
                          Hapus
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="px-5 py-8 text-center text-slate-400 text-sm">Tidak ada invoice ditemukan</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Invoice" : "Tambah Invoice"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!editingId && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Invoice ID *</label>
              <input type="text" required value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="INV-2026-001" />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Pelanggan *</label>
              <input type="text" required value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Nama pelanggan" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Paket / Plan *</label>
              <input type="text" required value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="50 Mbps" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Jumlah (Rp) *</label>
              <input type="number" min="0" required value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                <option value="unpaid">Belum Bayar</option>
                <option value="paid">Lunas</option>
                <option value="overdue">Jatuh Tempo</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Periode</label>
            <input type="text" value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Januari 2026" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Invoice</label>
              <input type="date" value={form.issueDate} onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Jatuh Tempo</label>
              <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Bayar</label>
              <input type="date" value={form.paidDate} onChange={(e) => setForm({ ...form, paidDate: e.target.value })}
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
              {saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Tambah Invoice"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Konfirmasi Hapus">
        <p className="text-sm text-slate-600 mb-4">Apakah Anda yakin ingin menghapus invoice ini? Tindakan ini tidak dapat dibatalkan.</p>
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

export default Billing
