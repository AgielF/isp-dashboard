import { useState, useEffect } from "react"
import StatCard from "../components/StatCard"
import { fetchInvoices, fetchBillingStats } from "../services/api"

function Billing() {
  const [invoices, setInvoices] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [invData, statData] = await Promise.all([
          fetchInvoices(),
          fetchBillingStats(),
        ])
        setInvoices(invData)
        setStats(statData)
      } catch (err) {
        console.error("Gagal memuat billing:", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency", currency: "IDR",
      minimumFractionDigits: 0, maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusBadge = (status) => {
    if (status === "paid") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
          Lunas
        </span>
      )
    }
    if (status === "overdue") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
          Jatuh Tempo
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
        Belum Bayar
      </span>
    )
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return "-"
    return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400 animate-pulse">Memuat data...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Billing</h1>
        <p className="text-sm text-slate-500 mt-1">Kelola tagihan dan pembayaran pelanggan</p>
      </div>

      {/* Stat Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Ditagihkan" value={formatCurrency(stats.totalInvoiced)} icon="📄" color="blue" subtitle={`${stats.totalInvoices} invoice`} />
          <StatCard title="Sudah Dibayar" value={formatCurrency(stats.totalPaid)} icon="✅" color="green" subtitle={`${stats.paidCount} invoice`} />
          <StatCard title="Belum Dibayar" value={formatCurrency(stats.totalUnpaid)} icon="⏳" color="yellow" subtitle={`${stats.unpaidCount} invoice`} />
          <StatCard title="Jatuh Tempo" value={formatCurrency(stats.totalOverdue)} icon="🚨" color="red" subtitle={`${stats.overdueCount} invoice`} />
        </div>
      )}

      {/* Invoice Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">Daftar Invoice</h2>
          <span className="text-xs text-slate-400">{invoices.length} tagihan</span>
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
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((inv) => (
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Billing
