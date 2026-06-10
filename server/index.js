import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import routerRoutes from './routes/routers.js';
import clientRoutes from './routes/clients.js';
import installationRoutes from './routes/installations.js';
import maintenanceRoutes from './routes/maintenance.js';
import billingRoutes from './routes/billing.js';
import financialRoutes from './routes/financial.js';
import bandwidthRoutes from './routes/bandwidth.js';
import alertRoutes from './routes/alerts.js';
import smyidRoutes from './routes/smyid.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/routers', routerRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/installations', installationRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/financial', financialRoutes);
app.use('/api/bandwidth', bandwidthRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/smyid', smyidRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`ISP Dashboard API running on http://localhost:${PORT}`);
});

export default app;
