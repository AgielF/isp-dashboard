import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import StatCard from "../components/StatCard"
import { fetchSMYOverview, fetchSiteSummary, fetchMonthlyData } from "../services/api"

function Installations() {
  const [stats, setStats] = useState(null)
  const [siteCumulative, setSiteCumulative] = useState([])
  const [siteCurrent, setSiteCurrent] = useState([])
  const [monthlyPSB, setMonthlyPSB] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [overview, sites, monthly] = await Promise.all([
          fetchSMYOverview(),
          fetchSiteSummary(),
          fetchMonthlyData("psb"),
        ])
        setStats(overview)
        setSiteCumulative(sites)
        setSiteCurrent(sites)
        setMonthlyPSB(monthly)
      } catch (err) {
        console.error("Gagal memuat data PSB:", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400 animate-pulse">Memuat data...</div>
      </div>
    )
  }

  const totalPSB = stats?.psb || 0
  const totalPembangunan = stats?.pembangunan || 0
  const totalCurrentPSB = siteCurrent.reduce((s, r) => s + (r.psbCurrentMonth || 0), 0)
  const totalCumulativePSB = siteCumulative.reduce((s, r) => s + r.psb, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Pemasangan Baru (PSB)</h1>
        <p className="text-sm text-slate-500 mt-1">
          Data pemasangan baru SMY.ID — {stats?.bulan} {stats?.tahun}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total PSB" value={totalPSB} icon="📋" color="blue" subtitle="Kumulatif keseluruhan" />
        <StatCard title="PSB Bulan Ini" value={totalCurrentPSB} icon="📌" color="green" subtitle={`${stats?.bulan} ${stats?.tahun}`} />
        <StatCard title="PSB Kumulatif Site" value={totalCumulativePSB} icon="🏗" color="cyan" subtitle="Semua site" />
        <StatCard title="Pembangunan" value={totalPembangunan} icon="🏢" color="purple" subtitle="Total keseluruhan" />
      </div>

      {/* Site Summary Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kumulatif */}
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
                <td className="px-5 py-3 text-right text-blue-700">
                  {siteCumulative.reduce((s, r) => s + r.psb, 0).toLocaleString("id-ID")}
                </td>
                <td className="px-5 py-3 text-right text-slate-600">
                  {siteCumulative.reduce((s, r) => s + r.mt, 0).toLocaleString("id-ID")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Bulan Berjalan */}
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
                <td className="px-5 py-3 text-right text-emerald-700">
                  {siteCurrent.reduce((s, r) => s + (r.psbCurrentMonth || 0), 0)}
                </td>
                <td className="px-5 py-3 text-right text-slate-600">
                  {siteCurrent.reduce((s, r) => s + (r.mtCurrentMonth || 0), 0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly PSB Chart */}
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
    </div>
  )
}

export default Installations
