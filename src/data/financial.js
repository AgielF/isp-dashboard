// Mock data - financial analytics

export const monthlyRevenue = [
  { month: "Jan", revenue: 10200000, target: 11000000 },
  { month: "Feb", revenue: 10800000, target: 11000000 },
  { month: "Mar", revenue: 11500000, target: 11500000 },
  { month: "Apr", revenue: 11200000, target: 11500000 },
  { month: "Mei", revenue: 12100000, target: 12000000 },
  { month: "Jun", revenue: 11800000, target: 12000000 }
]

export const revenueByPlan = [
  { name: "Home 20 Mbps", value: 750000, clients: 3 },
  { name: "Home 30 Mbps", value: 1050000, clients: 3 },
  { name: "Business 50 Mbps", value: 1700000, clients: 2 },
  { name: "Business 100 Mbps", value: 4500000, clients: 3 },
  { name: "Enterprise 200 Mbps", value: 2800000, clients: 1 },
  { name: "Enterprise 500 Mbps", value: 5500000, clients: 1 }
]

export const topClients = [
  { name: "PT Digital Creative", plan: "Enterprise 500 Mbps", monthlyRevenue: 5500000, totalPaid: 33000000 },
  { name: "PT Maju Jaya", plan: "Business 100 Mbps", monthlyRevenue: 1500000, totalPaid: 9000000 },
  { name: "Kantor Cabang SBY", plan: "Business 100 Mbps", monthlyRevenue: 1500000, totalPaid: 9000000 },
  { name: "CV Karya Mandiri", plan: "Business 50 Mbps", monthlyRevenue: 850000, totalPaid: 5100000 },
  { name: "UD Sumber Rejeki", plan: "Home 30 Mbps", monthlyRevenue: 350000, totalPaid: 2100000 },
  { name: "Toko Sinar Abadi", plan: "Home 30 Mbps", monthlyRevenue: 350000, totalPaid: 2100000 },
  { name: "Warung Kopi Nusantara", plan: "Home 20 Mbps", monthlyRevenue: 250000, totalPaid: 1250000 }
]

export const getFinancialStats = () => {
  const totalRevenue = monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0)
  const totalTarget = monthlyRevenue.reduce((sum, m) => sum + m.target, 0)
  const currentMonth = monthlyRevenue[monthlyRevenue.length - 1]
  const lastMonth = monthlyRevenue[monthlyRevenue.length - 2]
  const growth = currentMonth && lastMonth
    ? (((currentMonth.revenue - lastMonth.revenue) / lastMonth.revenue) * 100).toFixed(1)
    : 0
  const outstanding = 1950000 // unpaid + overdue from billing

  return {
    totalRevenue,
    totalTarget,
    currentMonthRevenue: currentMonth?.revenue || 0,
    monthlyTarget: currentMonth?.target || 0,
    growth: parseFloat(growth),
    outstanding,
    collectionRate: ((totalRevenue - outstanding) / totalRevenue * 100).toFixed(1)
  }
}
