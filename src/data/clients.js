// Mock data - struktur ini mencerminkan response API nyata
export const clients = [
  {
    id: 1,
    name: "PT Maju Jaya",
    plan: "Business 100 Mbps",
    ip: "10.0.1.10",
    router: "R-BDG-01",
    status: "active",
    bandwidth: 85.4,
    ping: 5,
    contractEnd: "2026-12-31"
  },
  {
    id: 2,
    name: "CV Karya Mandiri",
    plan: "Business 50 Mbps",
    ip: "10.0.1.20",
    router: "R-BDG-01",
    status: "active",
    bandwidth: 42.1,
    ping: 8,
    contractEnd: "2026-09-15"
  },
  {
    id: 3,
    name: "Toko Sinar Abadi",
    plan: "Home 30 Mbps",
    ip: "10.0.2.15",
    router: "R-CMH-01",
    status: "active",
    bandwidth: 22.8,
    ping: 12,
    contractEnd: "2027-03-01"
  },
  {
    id: 4,
    name: "Warung Kopi Nusantara",
    plan: "Home 20 Mbps",
    ip: "10.0.2.22",
    router: "R-CMH-01",
    status: "suspended",
    bandwidth: 0,
    ping: 0,
    contractEnd: "2026-05-01"
  },
  {
    id: 5,
    name: "PT Digital Creative",
    plan: "Enterprise 500 Mbps",
    ip: "10.0.3.5",
    router: "R-JTN-01",
    status: "active",
    bandwidth: 320.5,
    ping: 3,
    contractEnd: "2027-06-30"
  },
  {
    id: 6,
    name: "Kantor Cabang SBY",
    plan: "Business 100 Mbps",
    ip: "10.0.4.10",
    router: "R-SBY-01",
    status: "active",
    bandwidth: 78.2,
    ping: 15,
    contractEnd: "2026-11-20"
  },
  {
    id: 7,
    name: "UD Sumber Rejeki",
    plan: "Home 30 Mbps",
    ip: "10.0.5.8",
    router: "R-YGY-01",
    status: "active",
    bandwidth: 28.5,
    ping: 10,
    contractEnd: "2027-01-15"
  }
]

export const getClientStats = () => {
  const active = clients.filter(c => c.status === "active").length
  const suspended = clients.filter(c => c.status === "suspended").length
  const totalBandwidth = clients.reduce((sum, c) => sum + c.bandwidth, 0)

  return {
    total: clients.length,
    active,
    suspended,
    totalBandwidth: totalBandwidth.toFixed(1) + " Mbps"
  }
}
