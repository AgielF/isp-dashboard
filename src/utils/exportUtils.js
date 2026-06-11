import jsPDF from "jspdf"
import "jspdf-autotable"
import * as XLSX from "xlsx"

/**
 * Export data to PDF
 * @param {string} title - Document title
 * @param {string} subtitle - Optional subtitle
 * @param {string[]} headers - Column headers
 * @param {Array<Array>} rows - Data rows (array of arrays)
 * @param {string} filename - Output filename (without extension)
 */
export function exportPDF(title, subtitle, headers, rows, filename) {
  const doc = new jsPDF({ orientation: headers.length > 6 ? "landscape" : "portrait" })

  // Title
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text(title, 14, 20)

  // Subtitle
  if (subtitle) {
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(100)
    doc.text(subtitle, 14, 27)
    doc.setTextColor(0)
  }

  // Date
  doc.setFontSize(8)
  doc.text(`Diekspor: ${new Date().toLocaleString("id-ID")}`, 14, subtitle ? 33 : 27)

  // Table
  doc.autoTable({
    head: [headers],
    body: rows,
    startY: subtitle ? 37 : 31,
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [51, 65, 85], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 14, right: 14 },
  })

  doc.save(`${filename}.pdf`)
}

/**
 * Export data to Excel
 * @param {string} sheetName - Sheet name
 * @param {string[]} headers - Column headers
 * @param {Array<Array>} rows - Data rows (array of arrays)
 * @param {string} filename - Output filename (without extension)
 */
export function exportExcel(sheetName, headers, rows, filename) {
  const wsData = [headers, ...rows]
  const ws = XLSX.utils.aoa_to_sheet(wsData)

  // Auto column width
  const colWidths = headers.map((h, i) => {
    const maxLen = Math.max(
      h.length,
      ...rows.map(r => String(r[i] || "").length)
    )
    return { wch: Math.min(maxLen + 2, 30) }
  })
  ws["!cols"] = colWidths

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, sheetName)
  XLSX.writeFile(wb, `${filename}.xlsx`)
}

/**
 * Export dropdown button helper - returns formatted date string for filename
 */
export function getExportFilename(prefix) {
  const now = new Date()
  const date = now.toISOString().split("T")[0]
  return `${prefix}_${date}`
}
