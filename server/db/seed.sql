-- Seed Data for ISP Dashboard

-- Routers
INSERT INTO routers (name, location, ip, status, cpu, memory, uptime, traffic_in, traffic_out, last_seen) VALUES
('R-BDG-01', 'Bandung', '192.168.1.1', 'online', 25, 45, '15d 3h 22m', 1.2000, 0.8000, '2026-06-10T10:30:00Z'),
('R-CMH-01', 'Cimahi', '192.168.2.1', 'online', 32, 52, '8d 12h 45m', 0.8500, 0.6200, '2026-06-10T10:30:00Z'),
('R-JTN-01', 'Jakarta', '192.168.3.1', 'offline', 0, 0, '0d 0h 0m', 0, 0, '2026-06-10T08:15:00Z'),
('R-SBY-01', 'Surabaya', '192.168.4.1', 'online', 18, 38, '22d 5h 10m', 2.1000, 1.5000, '2026-06-10T10:30:00Z'),
('R-YGY-01', 'Yogyakarta', '192.168.5.1', 'online', 42, 61, '5d 18h 33m', 0.9500, 0.7100, '2026-06-10T10:30:00Z');

-- Clients
INSERT INTO clients (name, plan, ip, router_name, status, bandwidth, ping, contract_end) VALUES
('PT Maju Jaya', 'Business 100 Mbps', '10.0.1.10', 'R-BDG-01', 'active', 85.40, 5, '2026-12-31'),
('CV Karya Mandiri', 'Business 50 Mbps', '10.0.1.20', 'R-BDG-01', 'active', 42.10, 8, '2026-09-15'),
('Toko Sinar Abadi', 'Home 30 Mbps', '10.0.2.15', 'R-CMH-01', 'active', 22.80, 12, '2027-03-01'),
('Warung Kopi Nusantara', 'Home 20 Mbps', '10.0.2.22', 'R-CMH-01', 'suspended', 0, 0, '2026-05-01'),
('PT Digital Creative', 'Enterprise 500 Mbps', '10.0.3.5', 'R-JTN-01', 'active', 320.50, 3, '2027-06-30'),
('Kantor Cabang SBY', 'Business 100 Mbps', '10.0.4.10', 'R-SBY-01', 'active', 78.20, 15, '2026-11-20'),
('UD Sumber Rejeki', 'Home 30 Mbps', '10.0.5.8', 'R-YGY-01', 'active', 28.50, 10, '2027-01-15');

-- Installations
INSERT INTO installations (client_name, address, plan, technician, status, scheduled_date, completed_date, notes) VALUES
('PT Sentosa Utama', 'Jl. Asia Afrika No. 120, Bandung', 'Business 100 Mbps', 'Ahmad Fauzi', 'completed', '2026-06-02', '2026-06-02', 'Instalasi selesai, sinyal stabil'),
('CV Teknik Mandiri', 'Jl. Gatot Subroto No. 45, Cimahi', 'Business 50 Mbps', 'Budi Santoso', 'in-progress', '2026-06-09', NULL, 'Penarikan kabel fiber sedang berlangsung'),
('Toko Berkah Jaya', 'Jl. Ahmad Yani No. 88, Bandung', 'Home 30 Mbps', 'Rudi Hermawan', 'pending', '2026-06-12', NULL, 'Menunggu ketersediaan perangkat ODP'),
('PT Global Inovasi', 'Jl. Sudirman No. 200, Jakarta', 'Enterprise 500 Mbps', 'Ahmad Fauzi', 'in-progress', '2026-06-08', NULL, 'Konfigurasi router dan switch selesai, testing koneksi'),
('Rumah Makan Padang Sederhana', 'Jl. Diponegoro No. 33, Bandung', 'Home 20 Mbps', 'Dedi Kurniawan', 'completed', '2026-06-05', '2026-06-05', 'Selesai, pelanggan puas'),
('Kantor Notaris Hendra', 'Jl. Riau No. 15, Bandung', 'Business 50 Mbps', 'Budi Santoso', 'pending', '2026-06-14', NULL, 'Survei lokasi sudah dilakukan'),
('PT Karya Digital', 'Jl. Pemuda No. 77, Surabaya', 'Business 100 Mbps', 'Rudi Hermawan', 'completed', '2026-06-01', '2026-06-01', 'Instalasi multi-lantai, 3 access point'),
('Apotek Sehat Sentosa', 'Jl. Malioboro No. 55, Yogyakarta', 'Home 30 Mbps', 'Dedi Kurniawan', 'pending', '2026-06-15', NULL, 'Menunggu persetujuan pemilik gedung'),
('CV Logistik Nusantara', 'Jl. Industri No. 10, Cimahi', 'Business 100 Mbps', 'Ahmad Fauzi', 'in-progress', '2026-06-10', NULL, 'Splicing fiber optic dalam proses'),
('Sekolah Harapan Bangsa', 'Jl. Pendidikan No. 8, Bandung', 'Enterprise 200 Mbps', 'Budi Santoso', 'completed', '2026-05-28', '2026-05-29', 'Instalasi 2 hari, mencakup 5 ruang kelas');

-- Maintenance Logs
INSERT INTO maintenance_logs (router_name, type, description, technician, status, start_date, end_date, duration) VALUES
('R-BDG-01', 'preventive', 'Pembersihan dan pengecekan konektor fiber optic', 'Ahmad Fauzi', 'completed', '2026-06-08T08:00:00Z', '2026-06-08T10:30:00Z', '2j 30m'),
('R-JTN-01', 'corrective', 'Penggantian modul SFP yang rusak', 'Budi Santoso', 'in-progress', '2026-06-10T09:00:00Z', NULL, '-'),
('R-SBY-01', 'preventive', 'Update firmware ke versi terbaru v3.2.1', 'Rudi Hermawan', 'completed', '2026-06-09T13:00:00Z', '2026-06-09T14:30:00Z', '1j 30m'),
('R-YGY-01', 'emergency', 'Overheating - penggantian kipas pendingin', 'Dedi Kurniawan', 'completed', '2026-06-07T22:00:00Z', '2026-06-07T23:45:00Z', '1j 45m'),
('R-CMH-01', 'preventive', 'Pengecekan dan pembersihan rack server', 'Ahmad Fauzi', 'scheduled', '2026-06-13T08:00:00Z', NULL, '-'),
('R-BDG-01', 'corrective', 'Perbaikan konfigurasi VLAN yang error', 'Budi Santoso', 'completed', '2026-06-05T14:00:00Z', '2026-06-05T15:00:00Z', '1j 0m'),
('R-JTN-01', 'preventive', 'Backup konfigurasi dan audit keamanan', 'Rudi Hermawan', 'scheduled', '2026-06-15T09:00:00Z', NULL, '-'),
('R-SBY-01', 'emergency', 'Kabel fiber terputus akibat konstruksi jalan', 'Dedi Kurniawan', 'completed', '2026-06-03T16:00:00Z', '2026-06-03T19:30:00Z', '3j 30m');

-- Invoices
INSERT INTO invoices (id, client_name, plan, amount, status, issue_date, due_date, paid_date, period) VALUES
('INV-2026-001', 'PT Maju Jaya', 'Business 100 Mbps', 1500000, 'paid', '2026-06-01', '2026-06-15', '2026-06-10', 'Juni 2026'),
('INV-2026-002', 'CV Karya Mandiri', 'Business 50 Mbps', 850000, 'paid', '2026-06-01', '2026-06-15', '2026-06-08', 'Juni 2026'),
('INV-2026-003', 'Toko Sinar Abadi', 'Home 30 Mbps', 350000, 'unpaid', '2026-06-01', '2026-06-15', NULL, 'Juni 2026'),
('INV-2026-004', 'Warung Kopi Nusantara', 'Home 20 Mbps', 250000, 'overdue', '2026-05-01', '2026-05-15', NULL, 'Mei 2026'),
('INV-2026-005', 'PT Digital Creative', 'Enterprise 500 Mbps', 5500000, 'paid', '2026-06-01', '2026-06-15', '2026-06-05', 'Juni 2026'),
('INV-2026-006', 'Kantor Cabang SBY', 'Business 100 Mbps', 1500000, 'unpaid', '2026-06-01', '2026-06-15', NULL, 'Juni 2026'),
('INV-2026-007', 'UD Sumber Rejeki', 'Home 30 Mbps', 350000, 'paid', '2026-06-01', '2026-06-15', '2026-06-12', 'Juni 2026'),
('INV-2026-008', 'PT Maju Jaya', 'Business 100 Mbps', 1500000, 'paid', '2026-05-01', '2026-05-15', '2026-05-12', 'Mei 2026'),
('INV-2026-009', 'PT Digital Creative', 'Enterprise 500 Mbps', 5500000, 'paid', '2026-05-01', '2026-05-15', '2026-05-10', 'Mei 2026'),
('INV-2026-010', 'CV Karya Mandiri', 'Business 50 Mbps', 850000, 'overdue', '2026-05-01', '2026-05-15', NULL, 'Mei 2026');

-- Alerts
INSERT INTO alerts (type, message, router_name, timestamp, acknowledged) VALUES
('critical', 'Router R-JTN-01 offline - koneksi terputus', 'R-JTN-01', '2026-06-10T08:15:00Z', FALSE),
('warning', 'CPU usage tinggi pada R-YGY-01 (42%)', 'R-YGY-01', '2026-06-10T09:45:00Z', FALSE),
('info', 'Client PT Digital Creative upgrade ke plan Enterprise 500 Mbps', 'R-JTN-01', '2026-06-10T09:00:00Z', TRUE),
('warning', 'Latency tinggi terdeteksi pada R-SBY-01 (15ms)', 'R-SBY-01', '2026-06-10T07:30:00Z', TRUE),
('info', 'Maintenance terjadwal R-BDG-01 selesai', 'R-BDG-01', '2026-06-10T06:00:00Z', TRUE),
('critical', 'Client Warung Kopi Nusantara suspended - pembayaran tertunggak', 'R-CMH-01', '2026-06-09T18:00:00Z', TRUE),
('info', 'Router R-SBY-01 firmware updated ke v3.2.1', 'R-SBY-01', '2026-06-09T14:30:00Z', TRUE),
('warning', 'Bandwidth usage PT Maju Jaya mencapai 85% dari kapasitas plan', 'R-BDG-01', '2026-06-09T13:00:00Z', TRUE);

-- Monthly Revenue
INSERT INTO monthly_revenue (month, year, revenue, target) VALUES
('Jan', 2026, 10200000, 11000000),
('Feb', 2026, 10800000, 11000000),
('Mar', 2026, 11500000, 11500000),
('Apr', 2026, 11200000, 11500000),
('Mei', 2026, 12100000, 12000000),
('Jun', 2026, 11800000, 12000000);

-- SMY.ID Overview
INSERT INTO smyid_overview (psb_total, mt_total, pembangunan_total, dismantle_bill, bulan, tahun) VALUES
(406, 489, 18, 0, 'April', 2026);

-- SMY.ID Site Summary
INSERT INTO smyid_site_summary (site, psb_cumulative, mt_cumulative, psb_current_month, mt_current_month) VALUES
('KNC', 2248, 225, 33, 13),
('RPM', 735, 0, 9, 0),
('PTK', 535, 0, 21, 1);

-- SMY.ID Monthly PSB
INSERT INTO smyid_monthly (category, bulan, knc, rpm, ptk, total, tahun) VALUES
('psb', 'Jan', 0, 0, 0, 0, 2026), ('psb', 'Feb', 0, 0, 0, 0, 2026), ('psb', 'Mar', 0, 0, 0, 0, 2026),
('psb', 'Apr', 37, 18, 21, 76, 2026), ('psb', 'Mei', 0, 0, 0, 0, 2026), ('psb', 'Jun', 0, 0, 0, 0, 2026),
('psb', 'Jul', 0, 0, 0, 0, 2026), ('psb', 'Agu', 0, 0, 0, 0, 2026), ('psb', 'Sep', 0, 0, 0, 0, 2026),
('psb', 'Okt', 0, 0, 0, 0, 2026), ('psb', 'Nov', 0, 0, 0, 0, 2026), ('psb', 'Des', 0, 0, 0, 0, 2026);

-- SMY.ID Monthly Maintenance
INSERT INTO smyid_monthly (category, bulan, knc, rpm, ptk, total, tahun) VALUES
('mt', 'Jan', 0, 0, 0, 0, 2026), ('mt', 'Feb', 0, 0, 0, 0, 2026), ('mt', 'Mar', 0, 0, 0, 0, 2026),
('mt', 'Apr', 41, 28, 24, 93, 2026), ('mt', 'Mei', 0, 0, 0, 0, 2026), ('mt', 'Jun', 0, 0, 0, 0, 2026),
('mt', 'Jul', 0, 0, 0, 0, 2026), ('mt', 'Agu', 0, 0, 0, 0, 2026), ('mt', 'Sep', 0, 0, 0, 0, 2026),
('mt', 'Okt', 0, 0, 0, 0, 2026), ('mt', 'Nov', 0, 0, 0, 0, 2026), ('mt', 'Des', 0, 0, 0, 0, 2026);

-- SMY.ID Monthly Pembangunan
INSERT INTO smyid_monthly (category, bulan, knc, rpm, ptk, total, tahun) VALUES
('pembangunan', 'Jan', 0, 0, 0, 0, 2026), ('pembangunan', 'Feb', 0, 0, 0, 0, 2026), ('pembangunan', 'Mar', 0, 0, 0, 0, 2026),
('pembangunan', 'Apr', 1, 2, 2, 5, 2026), ('pembangunan', 'Mei', 0, 0, 0, 0, 2026), ('pembangunan', 'Jun', 0, 0, 0, 0, 2026),
('pembangunan', 'Jul', 0, 0, 0, 0, 2026), ('pembangunan', 'Agu', 0, 0, 0, 0, 2026), ('pembangunan', 'Sep', 0, 0, 0, 0, 2026),
('pembangunan', 'Okt', 0, 0, 0, 0, 2026), ('pembangunan', 'Nov', 0, 0, 0, 0, 2026), ('pembangunan', 'Des', 0, 0, 0, 0, 2026);
