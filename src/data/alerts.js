// Mock data - log alert / event sistem

export const alerts = [
  {
    id: 1,
    type: "critical",
    message: "Router R-JTN-01 offline - koneksi terputus",
    router: "R-JTN-01",
    timestamp: "2026-06-10T08:15:00Z",
    acknowledged: false
  },
  {
    id: 2,
    type: "warning",
    message: "CPU usage tinggi pada R-YGY-01 (42%)",
    router: "R-YGY-01",
    timestamp: "2026-06-10T09:45:00Z",
    acknowledged: false
  },
  {
    id: 3,
    type: "info",
    message: "Client PT Digital Creative upgrade ke plan Enterprise 500 Mbps",
    router: "R-JTN-01",
    timestamp: "2026-06-10T09:00:00Z",
    acknowledged: true
  },
  {
    id: 4,
    type: "warning",
    message: "Latency tinggi terdeteksi pada R-SBY-01 (15ms)",
    router: "R-SBY-01",
    timestamp: "2026-06-10T07:30:00Z",
    acknowledged: true
  },
  {
    id: 5,
    type: "info",
    message: "Maintenance terjadwal R-BDG-01 selesai",
    router: "R-BDG-01",
    timestamp: "2026-06-10T06:00:00Z",
    acknowledged: true
  },
  {
    id: 6,
    type: "critical",
    message: "Client Warung Kopi Nusantara suspended - pembayaran tertunggak",
    router: "R-CMH-01",
    timestamp: "2026-06-09T18:00:00Z",
    acknowledged: true
  },
  {
    id: 7,
    type: "info",
    message: "Router R-SBY-01 firmware updated ke v3.2.1",
    router: "R-SBY-01",
    timestamp: "2026-06-09T14:30:00Z",
    acknowledged: true
  },
  {
    id: 8,
    type: "warning",
    message: "Bandwidth usage PT Maju Jaya mencapai 85% dari kapasitas plan",
    router: "R-BDG-01",
    timestamp: "2026-06-09T13:00:00Z",
    acknowledged: true
  }
]

export const getAlertStats = () => {
  const critical = alerts.filter(a => a.type === "critical" && !a.acknowledged).length
  const warning = alerts.filter(a => a.type === "warning" && !a.acknowledged).length
  const unacknowledged = alerts.filter(a => !a.acknowledged).length

  return { critical, warning, unacknowledged }
}

export const formatAlertTime = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)

  if (diffMins < 60) return `${diffMins} menit lalu`
  if (diffHours < 24) return `${diffHours} jam lalu`
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
}
