// Mock data - bandwidth history untuk chart
// Setiap entry = 1 data point per 5 menit

const generateBandwidthData = (hours = 24) => {
  const data = []
  const now = new Date()
  const points = hours * 12 // setiap 5 menit

  for (let i = points; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 5 * 60 * 1000)
    const hour = time.getHours()

    // Simulasi pola trafik: tinggi di siang hari, rendah di malam
    const baseLoad = hour >= 8 && hour <= 22 ? 60 : 25
    const variance = Math.random() * 30 - 15

    data.push({
      time: time.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      timestamp: time.toISOString(),
      inbound: Math.max(5, baseLoad + variance + Math.random() * 10),
      outbound: Math.max(3, (baseLoad + variance) * 0.7 + Math.random() * 8)
    })
  }

  return data
}

export const bandwidthHistory = generateBandwidthData(24)

export const getLatestBandwidth = () => {
  const latest = bandwidthHistory[bandwidthHistory.length - 1]
  return {
    inbound: latest.inbound.toFixed(1) + " Gbps",
    outbound: latest.outbound.toFixed(1) + " Gbps"
  }
}
