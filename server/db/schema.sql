-- ISP Dashboard Database Schema

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS routers CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS installations CASCADE;
DROP TABLE IF EXISTS maintenance_logs CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS alerts CASCADE;
DROP TABLE IF EXISTS bandwidth_history CASCADE;
DROP TABLE IF EXISTS monthly_revenue CASCADE;
DROP TABLE IF EXISTS smyid_overview CASCADE;
DROP TABLE IF EXISTS smyid_site_summary CASCADE;
DROP TABLE IF EXISTS smyid_monthly CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE routers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  location VARCHAR(100),
  ip VARCHAR(50),
  status VARCHAR(20) DEFAULT 'online',
  cpu INTEGER DEFAULT 0,
  memory INTEGER DEFAULT 0,
  uptime VARCHAR(50),
  traffic_in DECIMAL(10,4) DEFAULT 0,
  traffic_out DECIMAL(10,4) DEFAULT 0,
  last_seen TIMESTAMP
);

CREATE TABLE clients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  plan VARCHAR(100),
  ip VARCHAR(50),
  router_name VARCHAR(50),
  status VARCHAR(20) DEFAULT 'active',
  bandwidth DECIMAL(10,2) DEFAULT 0,
  ping INTEGER DEFAULT 0,
  contract_end DATE
);

CREATE TABLE installations (
  id SERIAL PRIMARY KEY,
  client_name VARCHAR(200) NOT NULL,
  address TEXT,
  plan VARCHAR(100),
  technician VARCHAR(100),
  status VARCHAR(30) DEFAULT 'pending',
  scheduled_date DATE,
  completed_date DATE,
  notes TEXT
);

CREATE TABLE maintenance_logs (
  id SERIAL PRIMARY KEY,
  router_name VARCHAR(50),
  type VARCHAR(30) DEFAULT 'preventive',
  description TEXT,
  technician VARCHAR(100),
  status VARCHAR(30) DEFAULT 'scheduled',
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  duration VARCHAR(50)
);

CREATE TABLE invoices (
  id VARCHAR(30) PRIMARY KEY,
  client_name VARCHAR(200) NOT NULL,
  plan VARCHAR(100),
  amount BIGINT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'unpaid',
  issue_date DATE,
  due_date DATE,
  paid_date DATE,
  period VARCHAR(50)
);

CREATE TABLE alerts (
  id SERIAL PRIMARY KEY,
  type VARCHAR(20) DEFAULT 'info',
  message TEXT,
  router_name VARCHAR(50),
  timestamp TIMESTAMP DEFAULT NOW(),
  acknowledged BOOLEAN DEFAULT FALSE
);

CREATE TABLE bandwidth_history (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMP DEFAULT NOW(),
  inbound DECIMAL(10,4) DEFAULT 0,
  outbound DECIMAL(10,4) DEFAULT 0
);

CREATE TABLE monthly_revenue (
  id SERIAL PRIMARY KEY,
  month VARCHAR(10) NOT NULL,
  year INTEGER DEFAULT 2026,
  revenue BIGINT DEFAULT 0,
  target BIGINT DEFAULT 0
);

CREATE TABLE smyid_overview (
  id SERIAL PRIMARY KEY,
  psb_total INTEGER DEFAULT 0,
  mt_total INTEGER DEFAULT 0,
  pembangunan_total INTEGER DEFAULT 0,
  dismantle_bill INTEGER DEFAULT 0,
  bulan VARCHAR(20),
  tahun INTEGER
);

CREATE TABLE smyid_site_summary (
  id SERIAL PRIMARY KEY,
  site VARCHAR(10) NOT NULL,
  psb_cumulative INTEGER DEFAULT 0,
  mt_cumulative INTEGER DEFAULT 0,
  psb_current_month INTEGER DEFAULT 0,
  mt_current_month INTEGER DEFAULT 0
);

CREATE TABLE smyid_monthly (
  id SERIAL PRIMARY KEY,
  category VARCHAR(30) NOT NULL,
  bulan VARCHAR(10) NOT NULL,
  knc INTEGER DEFAULT 0,
  rpm INTEGER DEFAULT 0,
  ptk INTEGER DEFAULT 0,
  total INTEGER DEFAULT 0,
  tahun INTEGER DEFAULT 2026
);
