import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts"
import StatCard from "../components/StatCard"
import { fetchRevenue, fetchRevenueByPlan, fetchTopClients, fetchFinancialStats } from "../services/api"

function FinancialAnalytics() {
  const [monthlyRevenue, setMonthlyRevenue] = useState([])
  const [revenueByPlan, setRevenueByPlan] = useState([])
  const [topClients, setTopClients] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [rev, byPlan, top, finStats] = await Promise.all([
          fetchRevenue(),
          fetchRevenueByPlan(),
          fetchTopClients(),
          fetchFinancialStats(),
        ])
        setMonthlyRevenue(rev)
        setRevenueByPlan(byPlan)
        setTopClients(top)
        setStats(finStats)
      } catch (err) {
        console.error("Gagal memuat financial data:", err)
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

  const formatShortCurrency = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}jt`
    if (value >= 1000) return `${(value / 1000).toFixed(0)}rb`
    return value
  }

  const PIE_COLORS = ["#6366f1", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

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
        <h1 className="text-2xl font-bold text-slate-800">Financial Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">Analisis pendapatan dan performa finansial ISP</p>
      </div>

      {/* Stat Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Pendapatan Bulan Ini" value={formatCurrency(stats.currentMonthRevenue)} icon="💰" color="green" subtitle={`Target: ${formatCurrency(stats.monthlyTarget)}`} />
          <StatCard title="Total Revenue (6 bln)" value={formatCurrency(stats.totalRevenue)} icon="📊" color="blue" subtitle={`Target: ${formatCurrency(stats.totalTarget)}`} />
          <StatCard title="Growth MoM" value={`${stats.growth > 0 ? "+" : ""}${stats.growth}%`} icon="📈" color={stats.growth >= 0 ? "green" : "red"} subtitle="vs bulan lalu" />
          <StatCard title="Collection Rate" value={`${stats.collectionRate}%`} icon="🎯" color="purple" subtitle={`Outstanding: ${formatCurrency(stats.outstanding)}`} />
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-800">Pendapatan vs Target Bulanan</h2>
            <p className="text-xs text-slate-400">6 bulan terakhir</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" tickFormatter={formatShortCurrency} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px" }} formatter={(value) => formatCurrency(value)} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" name="Target" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Plan Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-800">Revenue per Plan</h2>
            <p className="text-xs text-slate-400">Distribusi pendapatan</p>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={revenueByPlan} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" nameKey="name">
                  {revenueByPlan.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1 mt-2">
            {revenueByPlan.map((plan, index) => (
              <div key={plan.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}></span>
                  <span className="text-slate-600 truncate">{plan.name}</span>
                </div>
                <span className="text-slate-500 font-medium">{formatShortCurrency(plan.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Clients Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">Top Pelanggan per Revenue</h2>
          <span className="text-xs text-slate-400">{topClients.length} pelanggan</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase">
                <th className="text-left px-5 py-3 font-medium">#</th>
                <th className="text-left px-5 py-3 font-medium">Pelanggan</th>
                <th className="text-left px-5 py-3 font-medium">Plan</th>
                <th className="text-right px-5 py-3 font-medium">Revenue Bulanan</th>
                <th className="text-right px-5 py-3 font-medium">Total Dibayar</th>
                <th className="text-left px-5 py-3 font-medium">Kontribusi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topClients.map((client, index) => {
                const totalMonthly = topClients.reduce((sum, c) => sum + c.monthlyRevenue, 0)
                const contribution = totalMonthly > 0 ? ((client.monthlyRevenue / totalMonthly) * 100).toFixed(1) : "0.0"
                return (
                  <tr key={client.name} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 text-xs text-slate-500 font-medium">{index + 1}</td>
                    <td className="px-5 py-3 font-medium text-slate-800">{client.name}</td>
                    <td className="px-5 py-3">
                      <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-md">{client.plan}</span>
                    </td>
                    <td className="px-5 py-3 text-right font-medium text-slate-800">{formatCurrency(client.monthlyRevenue)}</td>
                    <td className="px-5 py-3 text-right text-xs text-slate-600">{formatCurrency(client.totalPaid)}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-blue-500" style={{ width: `${contribution}%` }}></div>
                        </div>
                        <span className="text-xs text-slate-600">{contribution}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default FinancialAnalytics
