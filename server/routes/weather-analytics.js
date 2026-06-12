import { Router } from 'express';
import auth from '../middleware/auth.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Fungsi Korelasi Pearson
function getPearsonCorrelation(x, y) {
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
  const n = x.length;
  if (n === 0) return 0;
  for (let i = 0; i < n; i++) {
    sumX += x[i]; sumY += y[i]; sumXY += x[i] * y[i];
    sumX2 += x[i] * x[i]; sumY2 += y[i] * y[i];
  }
  const numerator = (n * sumXY) - (sumX * sumY);
  const denominator = Math.sqrt(((n * sumX2) - (sumX * sumX)) * ((n * sumY2) - (sumY * sumY)));
  return denominator === 0 ? 0 : numerator / denominator;
}

router.get('/correlation', auth, (req, res) => {
  try {
    const filePath = path.join(__dirname, '../data/laporan_harian_cuaca_isp.csv');
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').filter(line => line.trim() !== '');
    const headers = lines[0].split(',');

    const trenData = [];
    const arrHujan = [], arrAngin = [], arrHembusan = [];
    const arrMtTotal = [], arrMtKabel = [], arrMtMatot = [], arrPsb = [], arrDismantle = [];

    // Looping data mulai dari baris kedua (baris ke-0 adalah header)
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length < headers.length) continue;

      // Ambil tanggal dari kolom ke-0 (index 0)
      const tgl = values[0].trim();
      
      const hujan = Number(values[1]) || 0;
      const angin = Number(values[2]) || 0;
      const hembusan = Number(values[3]) || 0;
      const mtTotal = Number(values[4]) || 0;
      const mtKabel = Number(values[5]) || 0;
      const mtMatot = Number(values[6]) || 0;
      const psb = Number(values[7]) || 0;
      const dismantle = Number(values[8]) || 0;

      trenData.push({ tanggal: tgl, hujan, angin, hembusan, mtTotal, mtKabel, mtMatot, psb, dismantle });

      arrHujan.push(hujan); arrAngin.push(angin); arrHembusan.push(hembusan);
      arrMtTotal.push(mtTotal); arrMtKabel.push(mtKabel); arrMtMatot.push(mtMatot);
      arrPsb.push(psb); arrDismantle.push(dismantle);
    }

    // Matriks Korelasi
    const matriksData = {
      cuacaCols: ["Hujan (mm)", "Angin (km/h)", "Hembusan (km/h)"],
      ispRows: [
        { nama: "Maintenance", korelasi: [getPearsonCorrelation(arrMtTotal, arrHujan), getPearsonCorrelation(arrMtTotal, arrAngin), getPearsonCorrelation(arrMtTotal, arrHembusan)] },
        { nama: "Kabel Putus", korelasi: [getPearsonCorrelation(arrMtKabel, arrHujan), getPearsonCorrelation(arrMtKabel, arrAngin), getPearsonCorrelation(arrMtKabel, arrHembusan)] },
        { nama: "Matot", korelasi: [getPearsonCorrelation(arrMtMatot, arrHujan), getPearsonCorrelation(arrMtMatot, arrAngin), getPearsonCorrelation(arrMtMatot, arrHembusan)] },
        { nama: "PSB", korelasi: [getPearsonCorrelation(arrPsb, arrHujan), getPearsonCorrelation(arrPsb, arrAngin), getPearsonCorrelation(arrPsb, arrHembusan)] },
        { nama: "Dismantle", korelasi: [getPearsonCorrelation(arrDismantle, arrHujan), getPearsonCorrelation(arrDismantle, arrAngin), getPearsonCorrelation(arrDismantle, arrHembusan)] }
      ]
    };

    res.json({ tren: trenData, matriks: matriksData });
  } catch (error) {
    res.status(500).json({ message: "Gagal memproses data CSV." });
  }
});

export default router;