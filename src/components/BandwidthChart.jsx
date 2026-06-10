import { useState, useEffect } from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { fetchBandwidthHistory } from "../services/api"

function BandwidthChart() {
  const [bandwidthHistory, setBandwidthHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBandwidthHistory()
      .then(setBandwidthHistory)
      .catch(err => console.error("Gagal memuat bandwidth:", err))
      .finally(() => setLoading(false))
  }, [])

  // Ambil data setiap 30 menit (setiap 6 data point) untuk chart yang lebih bersih
  const chartData = bandwidthHistory.filter((_, i) => i % 6 === 0)

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
        <div className="text-slate-400 animate-pulse text-sm">Memuat bandwidth...</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Bandwidth Usage</h2>
          <p className="text-xs text-slate-400">24 jam terakhir (Gbps)</p>
        </div>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-blue-500 rounded-sm"></span>
            <span className="text-slate-600">Inbound</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-emerald-500 rounded-sm"></span>
            <span className="text-slate-600">Outbound</span>
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorInbound" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="92%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorOutbound" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="92%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="#94a3b8" />
            <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" unit=" Gbps" />
            <Tooltip
              contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px" }}
              labelStyle={{ fontWeight: "bold" }}
            />
            <Area
              type="monotone"
              dataKey="inbound"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorInbound)"
              name="Inbound"
            />
            <Area
              type="monotone"
              dataKey="outbound"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorOutbound)"
              name="Outbound"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default BandwidthChart
