// Mock data - billing (tagihan)

export const invoices = [
  {
    id: "INV-2026-001",
    client: "PT Maju Jaya",
    plan: "Business 100 Mbps",
    amount: 1500000,
    status: "paid",
    issueDate: "2026-06-01",
    dueDate: "2026-06-15",
    paidDate: "2026-06-10",
    period: "Juni 2026"
  },
  {
    id: "INV-2026-002",
    client: "CV Karya Mandiri",
    plan: "Business 50 Mbps",
    amount: 850000,
    status: "paid",
    issueDate: "2026-06-01",
    dueDate: "2026-06-15",
    paidDate: "2026-06-08",
    period: "Juni 2026"
  },
  {
    id: "INV-2026-003",
    client: "Toko Sinar Abadi",
    plan: "Home 30 Mbps",
    amount: 350000,
    status: "unpaid",
    issueDate: "2026-06-01",
    dueDate: "2026-06-15",
    paidDate: null,
    period: "Juni 2026"
  },
  {
    id: "INV-2026-004",
    client: "Warung Kopi Nusantara",
    plan: "Home 20 Mbps",
    amount: 250000,
    status: "overdue",
    issueDate: "2026-05-01",
    dueDate: "2026-05-15",
    paidDate: null,
    period: "Mei 2026"
  },
  {
    id: "INV-2026-005",
    client: "PT Digital Creative",
    plan: "Enterprise 500 Mbps",
    amount: 5500000,
    status: "paid",
    issueDate: "2026-06-01",
    dueDate: "2026-06-15",
    paidDate: "2026-06-05",
    period: "Juni 2026"
  },
  {
    id: "INV-2026-006",
    client: "Kantor Cabang SBY",
    plan: "Business 100 Mbps",
    amount: 1500000,
    status: "unpaid",
    issueDate: "2026-06-01",
    dueDate: "2026-06-15",
    paidDate: null,
    period: "Juni 2026"
  },
  {
    id: "INV-2026-007",
    client: "UD Sumber Rejeki",
    plan: "Home 30 Mbps",
    amount: 350000,
    status: "paid",
    issueDate: "2026-06-01",
    dueDate: "2026-06-15",
    paidDate: "2026-06-12",
    period: "Juni 2026"
  },
  {
    id: "INV-2026-008",
    client: "PT Maju Jaya",
    plan: "Business 100 Mbps",
    amount: 1500000,
    status: "paid",
    issueDate: "2026-05-01",
    dueDate: "2026-05-15",
    paidDate: "2026-05-12",
    period: "Mei 2026"
  },
  {
    id: "INV-2026-009",
    client: "PT Digital Creative",
    plan: "Enterprise 500 Mbps",
    amount: 5500000,
    status: "paid",
    issueDate: "2026-05-01",
    dueDate: "2026-05-15",
    paidDate: "2026-05-10",
    period: "Mei 2026"
  },
  {
    id: "INV-2026-010",
    client: "CV Karya Mandiri",
    plan: "Business 50 Mbps",
    amount: 850000,
    status: "overdue",
    issueDate: "2026-05-01",
    dueDate: "2026-05-15",
    paidDate: null,
    period: "Mei 2026"
  }
]

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export const getBillingStats = () => {
  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.amount, 0)
  const paid = invoices.filter(inv => inv.status === "paid")
  const unpaid = invoices.filter(inv => inv.status === "unpaid")
  const overdue = invoices.filter(inv => inv.status === "overdue")

  const totalPaid = paid.reduce((sum, inv) => sum + inv.amount, 0)
  const totalUnpaid = unpaid.reduce((sum, inv) => sum + inv.amount, 0)
  const totalOverdue = overdue.reduce((sum, inv) => sum + inv.amount, 0)

  return {
    totalInvoices: invoices.length,
    totalInvoiced,
    paidCount: paid.length,
    totalPaid,
    unpaidCount: unpaid.length,
    totalUnpaid,
    overdueCount: overdue.length,
    totalOverdue
  }
}
