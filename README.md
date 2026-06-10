```markdown|CODE_EDIT_BLOCK|c:\Users\62822\isp-dashboard\README.md
# ISP Dashboard

Dashboard monitoring untuk ISP (Internet Service Provider) yang dibangun dengan React, Express.js, dan PostgreSQL. Menyediakan fitur monitoring router, manajemen klien, instalasi, maintenance, billing, analitik keuangan, dan integrasi data SMY.ID.

## 📋 Fitur

- **Dashboard** – Ringkasan statistik router, klien, dan jaringan
- **Manajemen Router** – Monitoring status, CPU, memory, dan traffic router
- **Manajemen Klien** – Daftar klien, paket, bandwidth, dan status koneksi
- **Instalasi** – Tracking jadwal dan status instalasi baru
- **Maintenance** – Log perawatan dan pemeliharaan jaringan
- **Billing** – Manajemen invoice dan pembayaran klien
- **Analitik Keuangan** – Grafik pendapatan bulanan dan target
- **Bandwidth Monitoring** – Grafik penggunaan bandwidth jaringan
- **Alert Log** – Log peringatan dan notifikasi sistem
- **SMY.ID Integration** – Data operasional PSB, MT, dan pembangunan per site

## 🛠️ Prasyarat

Sebelum menjalankan project ini, pastikan kamu sudah menginstall:

- [Node.js](https://nodejs.org/) (versi 18 atau lebih baru)
- [PostgreSQL](https://www.postgresql.org/download/) (versi 14 atau lebih baru)
- [Git](https://git-scm.com/)

## 📦 Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/Farhann21/isp-dashboard.git
cd isp-dashboard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Konfigurasi Database

Pastikan PostgreSQL sudah berjalan di perangkatmu. Kemudian buat file `.env` di folder `server/` dengan isi berikut:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=isp_dashboard
DB_USER=postgres
DB_PASSWORD=password_postgres_kamu
JWT_SECRET=secret-key-bebas
PORT=3001
```

> ⚠️ **Penting:** Ubah `DB_USER` dan `DB_PASSWORD` sesuai dengan kredensial PostgreSQL yang kamu gunakan.

### 4. Inisialisasi Database

Jalankan perintah berikut untuk membuat database, tabel, dan data awal secara otomatis:

```bash
npm run db:init
```

Perintah ini akan:
- Membuat database `isp_dashboard` (jika belum ada)
- Menjalankan skema tabel dari `schema.sql`
- Mengisi data awal dari `seed.sql`
- Membuat user admin dengan kredensial:
  - **Username:** `admin`
  - **Password:** `admin123`

## 🚀 Cara Menjalankan

### Menjalankan Frontend & Backend sekaligus

```bash
npm run dev:all
```

Perintah ini akan menjalankan server API (port 3001) dan frontend React (port 5173) secara bersamaan.

### Menjalankan secara terpisah

**Backend (API Server):**

```bash
npm run server
```

Server akan berjalan di `http://localhost:3001`

**Frontend (React App):**

```bash
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

## 🔐 Akses Aplikasi

1. Buka browser dan akses `http://localhost:5173`
2. Login dengan kredensial admin:
   - **Username:** `admin`
   - **Password:** `admin123`

## 📁 Struktur Folder

```
isp-dashboard/
├── public/                 # File statis publik
├── server/                 # Backend Express.js
│   ├── db/                 # Konfigurasi database
│   │   ├── init.js         # Script inisialisasi database
│   │   ├── pool.js         # Koneksi pool PostgreSQL
│   │   ├── schema.sql      # Skema tabel database
│   │   └── seed.sql        # Data awal (dummy)
│   ├── middleware/          # Middleware (autentikasi JWT)
│   ├── routes/             # API routes per modul
│   ├── .env                # Konfigurasi environment
│   └── index.js            # Entry point server
├── src/                    # Frontend React
│   ├── components/         # Komponen UI reusable
│   ├── contexts/           # React Context (autentikasi)
│   ├── data/               # Mock data
│   ├── pages/              # Halaman utama aplikasi
│   ├── services/           # Service API call
│   ├── App.jsx             # Komponen utama & routing
│   └── main.jsx            # Entry point React
└── package.json            # Dependencies & scripts
```

## 🧰 Tech Stack

| Bagian     | Teknologi                              |
|------------|----------------------------------------|
| Frontend   | React 19, Vite, Tailwind CSS, Recharts |
| Backend    | Express.js, JSON Web Token, bcrypt     |
| Database   | PostgreSQL                             |
| Routing    | React Router DOM v7                    |
| Dev Tools  | ESLint, Concurrently                   |

## 📝 Catatan

- File `.env` **tidak** ter-upload ke GitHub karena berisi kredensial sensitif
- Setelah clone, kamu **wajib** membuat file `.env` sendiri di folder `server/`
- Jika port 3001 atau 5173 sudah terpakai, ubah di `.env` dan `vite.config.js`

## 🤝 Kontribusi

1. Fork repository ini
2. Buat branch baru (`git checkout -b fitur-baru`)
3. Commit perubahan (`git commit -m "Menambahkan fitur baru"`)
4. Push ke branch (`git push origin fitur-baru`)
5. Buat Pull Request
```

README ini sudah mencakup semua informasi yang dibutuhkan temanmu untuk menjalankan project dari nol: prasyarat, instalasi, konfigurasi database, cara menjalankan, hingga struktur folder. Jangan lupa ganti `USERNAME` di URL clone dengan username GitHub kamu.