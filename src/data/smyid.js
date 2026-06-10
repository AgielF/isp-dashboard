// Real data from DASHBOARD SMY.ID - April 2026

export const overview = {
  psb: 406,
  maintenance: 489,
  pembangunan: 18,
  dismantleBill: 0,
  bulan: "April",
  tahun: 2026
}

// Kumulatif per site (all time)
export const siteSummaryCumulative = [
  { site: "KNC", psb: 2248, mt: 225 },
  { site: "RPM", psb: 735, mt: 0 },
  { site: "PTK", psb: 535, mt: 0 }
]

// Per site bulan berjalan (April 2026)
export const siteSummaryCurrentMonth = [
  { site: "KNC", psb: 33, mt: 13 },
  { site: "RPM", psb: 9, mt: 0 },
  { site: "PTK", psb: 21, mt: 1 }
]

// PSB bulanan 2026
export const monthlyPSB = [
  { bulan: "Jan", knc: 0, rpm: 0, ptk: 0, total: 0 },
  { bulan: "Feb", knc: 0, rpm: 0, ptk: 0, total: 0 },
  { bulan: "Mar", knc: 0, rpm: 0, ptk: 0, total: 0 },
  { bulan: "Apr", knc: 37, rpm: 18, ptk: 21, total: 76 },
  { bulan: "Mei", knc: 0, rpm: 0, ptk: 0, total: 0 },
  { bulan: "Jun", knc: 0, rpm: 0, ptk: 0, total: 0 },
  { bulan: "Jul", knc: 0, rpm: 0, ptk: 0, total: 0 },
  { bulan: "Agu", knc: 0, rpm: 0, ptk: 0, total: 0 },
  { bulan: "Sep", knc: 0, rpm: 0, ptk: 0, total: 0 },
  { bulan: "Okt", knc: 0, rpm: 0, ptk: 0, total: 0 },
  { bulan: "Nov", knc: 0, rpm: 0, ptk: 0, total: 0 },
  { bulan: "Des", knc: 0, rpm: 0, ptk: 0, total: 0 }
]

// Maintenance bulanan 2026
export const monthlyMT = [
  { bulan: "Jan", knc: 0, rpm: 0, ptk: 0, total: 0 },
  { bulan: "Feb", knc: 0, rpm: 0, ptk: 0, total: 0 },
  { bulan: "Mar", knc: 0, rpm: 0, ptk: 0, total: 0 },
  { bulan: "Apr", knc: 41, rpm: 28, ptk: 24, total: 93 },
  { bulan: "Mei", knc: 0, rpm: 0, ptk: 0, total: 0 },
  { bulan: "Jun", knc: 0, rpm: 0, ptk: 0, total: 0 },
  { bulan: "Jul", knc: 0, rpm: 0, ptk: 0, total: 0 },
  { bulan: "Agu", knc: 0, rpm: 0, ptk: 0, total: 0 },
  { bulan: "Sep", knc: 0, rpm: 0, ptk: 0, total: 0 },
  { bulan: "Okt", knc: 0, rpm: 0, ptk: 0, total: 0 },
  { bulan: "Nov", knc: 0, rpm: 0, ptk: 0, total: 0 },
  { bulan: "Des", knc: 0, rpm: 0, ptk: 0, total: 0 }
]

// Pembangunan bulanan 2026
export const monthlyPembangunan = [
  { bulan: "Jan", knc: 0, rpm: 0, ptk: 0, total: 0 },
  { bulan: "Feb", knc: 0, rpm: 0, ptk: 0, total: 0 },
  { bulan: "Mar", knc: 0, rpm: 0, ptk: 0, total: 0 },
  { bulan: "Apr", knc: 1, rpm: 2, ptk: 2, total: 5 },
  { bulan: "Mei", knc: 0, rpm: 0, ptk: 0, total: 0 },
  { bulan: "Jun", knc: 0, rpm: 0, ptk: 0, total: 0 },
  { bulan: "Jul", knc: 0, rpm: 0, ptk: 0, total: 0 },
  { bulan: "Agu", knc: 0, rpm: 0, ptk: 0, total: 0 },
  { bulan: "Sep", knc: 0, rpm: 0, ptk: 0, total: 0 },
  { bulan: "Okt", knc: 0, rpm: 0, ptk: 0, total: 0 },
  { bulan: "Nov", knc: 0, rpm: 0, ptk: 0, total: 0 },
  { bulan: "Des", knc: 0, rpm: 0, ptk: 0, total: 0 }
]

export const getSMYStats = () => {
  const totalCumulativePSB = siteSummaryCumulative.reduce((s, r) => s + r.psb, 0)
  const totalCumulativeMT = siteSummaryCumulative.reduce((s, r) => s + r.mt, 0)
  const totalCurrentPSB = siteSummaryCurrentMonth.reduce((s, r) => s + r.psb, 0)
  const totalCurrentMT = siteSummaryCurrentMonth.reduce((s, r) => s + r.mt, 0)

  return {
    ...overview,
    totalCumulativePSB,
    totalCumulativeMT,
    totalCurrentPSB,
    totalCurrentMT
  }
}
