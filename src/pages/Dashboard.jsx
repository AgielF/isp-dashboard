import { useState, useEffect } from "react"
import StatCard from "../components/StatCard"
import RouterTable from "../components/RouterTable"
import BandwidthChart from "../components/BandwidthChart"
import ClientTable from "../components/ClientTable"
import AlertLog from "../components/AlertLog"
import { fetchDashboardStats, fetchSMYOverview, fetchSiteSummary } from "../services/api"

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [smy, setSmy] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [dashData, smyData, siteData] = await Promise.all([
          fetchDashboardStats(),
          fetchSMYOverview(),
          fetchSiteSummary(),
        ])
        setStats(dashData)
        const totalCurrentPSB = siteData.reduce((s, r) => s + (r.psbCurrentMonth || 0), 0)
        const totalCurrentMT = siteData.reduce((s, r) => s + (r.mtCurrentMonth || 0), 0)
        setSmy({ ...smyData, totalCurrentPSB, totalCurrentMT })
      } catch (err) {
        console.error("Gagal memuat statistik:", err)
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

  return (
    <div className="space-y-6">

      {/* SMY.ID Real Stats */}
      {smy && (
        <>
          <div>
            <h2 className="text-lg font-bold text-slate-800">SMY.ID Overview</h2>
            <p className="text-xs text-slate-400">Data aktual — {smy.bulan} {smy.tahun}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total PSB" value={smy.psb} icon="📋" color="blue" subtitle="Pemasangan baru kumulatif" />
            <StatCard title="Total Maintenance" value={smy.maintenance} icon="🔧" color="green" subtitle="Kumulatif keseluruhan" />
            <StatCard title="Pembangunan" value={smy.pembangunan} icon="🏢" color="purple" subtitle="Total keseluruhan" />
            <StatCard title="PSB Bulan Ini" value={smy.totalCurrentPSB} icon="📌" color="cyan" subtitle={`MT: ${smy.totalCurrentMT}`} />
          </div>
        </>
      )}

      <hr className="border-slate-200" />

      {/* Network Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard title="Pelanggan Aktif" value={stats.clients.active} icon="👥" color="blue" subtitle={`dari ${stats.clients.total} total`} />
          <StatCard title="Router Online" value={stats.routers.online} icon="📡" color="green" subtitle={`dari ${stats.routers.total} total`} />
          <StatCard title="Router Offline" value={stats.routers.offline} icon="⚠" color="red" subtitle={stats.routers.offline > 0 ? "Perlu perhatian" : "Semua normal"} />
          <StatCard title="Total Bandwidth" value={stats.routers.totalTraffic} icon="📊" color="cyan" subtitle="Semua router" />
          <StatCard title="Alert Aktif" value={stats.alerts.unacknowledged} icon="🔔" color="yellow" subtitle={`${stats.alerts.critical} critical`} />
          <StatCard title="Total Usage" value={stats.clients.totalBandwidth} icon="💾" color="purple" subtitle="Pelanggan aktif" />
        </div>
      )}

      {/* Bandwidth Chart + Alert Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BandwidthChart />
        </div>
        <div>
          <AlertLog />
        </div>
      </div>

      {/* Router Table */}
      <RouterTable />

      {/* Client Table */}
      <ClientTable />

    </div>
  )
}

export default Dashboard
