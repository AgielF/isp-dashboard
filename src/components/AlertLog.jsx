import { useState, useEffect } from "react"
import { fetchAlerts } from "../services/api"

function AlertLog() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAlerts()
      .then(setAlerts)
      .catch(err => console.error("Gagal memuat alert:", err))
      .finally(() => setLoading(false))
  }, [])

  const getTypeIcon = (type) => {
    switch (type) {
      case "critical":
        return (
          <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm flex-shrink-0">!</div>
        )
      case "warning":
        return (
          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm flex-shrink-0">!</div>
        )
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm flex-shrink-0">i</div>
        )
    }
  }

  const getTypeBorder = (type) => {
    switch (type) {
      case "critical": return "border-l-red-500"
      case "warning": return "border-l-amber-500"
      default: return "border-l-blue-500"
    }
  }

  const formatAlertTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)

    if (diffMins < 60) return `${diffMins} menit lalu`
    if (diffHours < 24) return `${diffHours} jam lalu`
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
        <div className="text-slate-400 animate-pulse text-sm">Memuat alert...</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Log & Alert</h2>
          <p className="text-xs text-slate-400">Event terbaru sistem</p>
        </div>
        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
          {alerts.filter(a => !a.acknowledged).length} belum dibaca
        </span>
      </div>

      <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`px-5 py-3 flex items-start gap-3 border-l-4 ${getTypeBorder(alert.type)} ${
              !alert.acknowledged ? "bg-slate-50" : ""
            }`}
          >
            {getTypeIcon(alert.type)}
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${!alert.acknowledged ? "font-semibold text-slate-800" : "text-slate-600"}`}>
                {alert.message}
              </p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-slate-400">{alert.router}</span>
                <span className="text-xs text-slate-400">{formatAlertTime(alert.timestamp)}</span>
              </div>
            </div>
            {!alert.acknowledged && (
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default AlertLog
