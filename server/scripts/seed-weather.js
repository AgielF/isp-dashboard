import pool from '../db/pool.js';
import * as xlsx from 'xlsx';
import fs from 'fs'; // Tambahkan modul fs
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedWeather() {
  try {
    console.log("⏳ Memulai proses pembuatan tabel dan seeding data cuaca...");

    // 1. Buat Tabel di PostgreSQL
    await pool.query(`
      CREATE TABLE IF NOT EXISTS weather_bandung (
        id SERIAL PRIMARY KEY,
        waktu TIMESTAMP UNIQUE NOT NULL,
        suhu NUMERIC,
        kelembapan NUMERIC,
        curah_hujan NUMERIC,
        kecepatan_angin NUMERIC,
        hembusan_angin_max NUMERIC,
        deskripsi_cuaca VARCHAR(100)
      );
    `);
    console.log("✅ Tabel 'weather_bandung' berhasil disiapkan.");

    // 2. Baca File Excel menggunakan 'fs' (Solusi Error ES Module)
    const filePath = path.join(__dirname, '../data/data_cuaca_bandung_hourly_2026.xlsx');
    console.log(`⏳ Membaca file Excel dari: ${filePath}`);
    
    const fileBuffer = fs.readFileSync(filePath);
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    
    const sheetName = workbook.SheetNames[0]; 
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    console.log(`✅ Ditemukan ${data.length} baris data cuaca. Mulai memasukkan ke database...`);

    // 3. Masukkan Data ke Database
    let inserted = 0;
    
    for (const row of data) {
      const waktu = row['Waktu']; 
      const suhu = row['Suhu (°C)'] || 0;
      const kelembapan = row['Kelembapan (%)'] || 0;
      const curahHujan = row['Curah Hujan Total (mm)'] || 0;
      const kecepatanAngin = row['Kecepatan Angin (km/h)'] || 0;
      const hembusanAnginMax = row['Hembusan Angin Maksimal (km/h)'] || 0;
      const deskripsiCuaca = row['Deskripsi Cuaca'] || '';

      if (!waktu) continue;

      await pool.query(`
        INSERT INTO weather_bandung (
          waktu, suhu, kelembapan, curah_hujan, kecepatan_angin, hembusan_angin_max, deskripsi_cuaca
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (waktu) DO NOTHING
      `, [waktu, suhu, kelembapan, curahHujan, kecepatanAngin, hembusanAnginMax, deskripsiCuaca]);

      inserted++;
    }

    console.log(`🎉 Seeding Selesai! Berhasil memproses ${inserted} baris data ke PostgreSQL.`);
    
    process.exit(0);

  } catch (error) {
    console.error("❌ Terjadi kesalahan saat seeding:", error);
    process.exit(1);
  }
}

seedWeather();