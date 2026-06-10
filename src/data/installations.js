// Mock data - pemasangan baru (new installations)

export const installations = [
  {
    id: 1,
    clientName: "PT Sentosa Utama",
    address: "Jl. Asia Afrika No. 120, Bandung",
    plan: "Business 100 Mbps",
    technician: "Ahmad Fauzi",
    status: "completed",
    scheduledDate: "2026-06-02",
    completedDate: "2026-06-02",
    notes: "Instalasi selesai, sinyal stabil"
  },
  {
    id: 2,
    clientName: "CV Teknik Mandiri",
    address: "Jl. Gatot Subroto No. 45, Cimahi",
    plan: "Business 50 Mbps",
    technician: "Budi Santoso",
    status: "in-progress",
    scheduledDate: "2026-06-09",
    completedDate: null,
    notes: "Penarikan kabel fiber sedang berlangsung"
  },
  {
    id: 3,
    clientName: "Toko Berkah Jaya",
    address: "Jl. Ahmad Yani No. 88, Bandung",
    plan: "Home 30 Mbps",
    technician: "Rudi Hermawan",
    status: "pending",
    scheduledDate: "2026-06-12",
    completedDate: null,
    notes: "Menunggu ketersediaan perangkat ODP"
  },
  {
    id: 4,
    clientName: "PT Global Inovasi",
    address: "Jl. Sudirman No. 200, Jakarta",
    plan: "Enterprise 500 Mbps",
    technician: "Ahmad Fauzi",
    status: "in-progress",
    scheduledDate: "2026-06-08",
    completedDate: null,
    notes: "Konfigurasi router dan switch selesai, testing koneksi"
  },
  {
    id: 5,
    clientName: "Rumah Makan Padang Sederhana",
    address: "Jl. Diponegoro No. 33, Bandung",
    plan: "Home 20 Mbps",
    technician: "Dedi Kurniawan",
    status: "completed",
    scheduledDate: "2026-06-05",
    completedDate: "2026-06-05",
    notes: "Selesai, pelanggan puas"
  },
  {
    id: 6,
    clientName: "Kantor Notaris Hendra",
    address: "Jl. Riau No. 15, Bandung",
    plan: "Business 50 Mbps",
    technician: "Budi Santoso",
    status: "pending",
    scheduledDate: "2026-06-14",
    completedDate: null,
    notes: "Survei lokasi sudah dilakukan"
  },
  {
    id: 7,
    clientName: "PT Karya Digital",
    address: "Jl. Pemuda No. 77, Surabaya",
    plan: "Business 100 Mbps",
    technician: "Rudi Hermawan",
    status: "completed",
    scheduledDate: "2026-06-01",
    completedDate: "2026-06-01",
    notes: "Instalasi multi-lantai, 3 access point"
  },
  {
    id: 8,
    clientName: "Apotek Sehat Sentosa",
    address: "Jl. Malioboro No. 55, Yogyakarta",
    plan: "Home 30 Mbps",
    technician: "Dedi Kurniawan",
    status: "pending",
    scheduledDate: "2026-06-15",
    completedDate: null,
    notes: "Menunggu persetujuan pemilik gedung"
  },
  {
    id: 9,
    clientName: "CV Logistik Nusantara",
    address: "Jl. Industri No. 10, Cimahi",
    plan: "Business 100 Mbps",
    technician: "Ahmad Fauzi",
    status: "in-progress",
    scheduledDate: "2026-06-10",
    completedDate: null,
    notes: "Splicing fiber optic dalam proses"
  },
  {
    id: 10,
    clientName: "Sekolah Harapan Bangsa",
    address: "Jl. Pendidikan No. 8, Bandung",
    plan: "Enterprise 200 Mbps",
    technician: "Budi Santoso",
    status: "completed",
    scheduledDate: "2026-05-28",
    completedDate: "2026-05-29",
    notes: "Instalasi 2 hari, mencakup 5 ruang kelas"
  }
]

export const getInstallationStats = () => {
  const total = installations.length
  const pending = installations.filter(i => i.status === "pending").length
  const inProgress = installations.filter(i => i.status === "in-progress").length
  const completed = installations.filter(i => i.status === "completed").length

  return { total, pending, inProgress, completed }
}
