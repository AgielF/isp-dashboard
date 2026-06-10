// Mock data - maintenance (pemeliharaan)

export const maintenanceLogs = [
  {
    id: 1,
    router: "R-BDG-01",
    type: "preventive",
    description: "Pembersihan dan pengecekan konektor fiber optic",
    technician: "Ahmad Fauzi",
    status: "completed",
    startDate: "2026-06-08T08:00:00Z",
    endDate: "2026-06-08T10:30:00Z",
    duration: "2j 30m"
  },
  {
    id: 2,
    router: "R-JTN-01",
    type: "corrective",
    description: "Penggantian modul SFP yang rusak",
    technician: "Budi Santoso",
    status: "in-progress",
    startDate: "2026-06-10T09:00:00Z",
    endDate: null,
    duration: "-"
  },
  {
    id: 3,
    router: "R-SBY-01",
    type: "preventive",
    description: "Update firmware ke versi terbaru v3.2.1",
    technician: "Rudi Hermawan",
    status: "completed",
    startDate: "2026-06-09T13:00:00Z",
    endDate: "2026-06-09T14:30:00Z",
    duration: "1j 30m"
  },
  {
    id: 4,
    router: "R-YGY-01",
    type: "emergency",
    description: "Overheating - penggantian kipas pendingin",
    technician: "Dedi Kurniawan",
    status: "completed",
    startDate: "2026-06-07T22:00:00Z",
    endDate: "2026-06-07T23:45:00Z",
    duration: "1j 45m"
  },
  {
    id: 5,
    router: "R-CMH-01",
    type: "preventive",
    description: "Pengecekan dan pembersihan rack server",
    technician: "Ahmad Fauzi",
    status: "scheduled",
    startDate: "2026-06-13T08:00:00Z",
    endDate: null,
    duration: "-"
  },
  {
    id: 6,
    router: "R-BDG-01",
    type: "corrective",
    description: "Perbaikan konfigurasi VLAN yang error",
    technician: "Budi Santoso",
    status: "completed",
    startDate: "2026-06-05T14:00:00Z",
    endDate: "2026-06-05T15:00:00Z",
    duration: "1j 0m"
  },
  {
    id: 7,
    router: "R-JTN-01",
    type: "preventive",
    description: "Backup konfigurasi dan audit keamanan",
    technician: "Rudi Hermawan",
    status: "scheduled",
    startDate: "2026-06-15T09:00:00Z",
    endDate: null,
    duration: "-"
  },
  {
    id: 8,
    router: "R-SBY-01",
    type: "emergency",
    description: "Kabel fiber terputus akibat konstruksi jalan",
    technician: "Dedi Kurniawan",
    status: "completed",
    startDate: "2026-06-03T16:00:00Z",
    endDate: "2026-06-03T19:30:00Z",
    duration: "3j 30m"
  }
]

export const getMaintenanceStats = () => {
  const scheduled = maintenanceLogs.filter(m => m.status === "scheduled").length
  const inProgress = maintenanceLogs.filter(m => m.status === "in-progress").length
  const completed = maintenanceLogs.filter(m => m.status === "completed").length
  const emergency = maintenanceLogs.filter(m => m.type === "emergency").length

  return { scheduled, inProgress, completed, emergency, total: maintenanceLogs.length }
}
