import { Router } from 'express';
import pool from '../db/pool.js';
import auth from '../middleware/auth.js';

const router = Router();

router.get('/stats', auth, async (req, res) => {
  try {
    const [routerResult, clientResult, alertResult] = await Promise.all([
      pool.query('SELECT * FROM routers'),
      pool.query('SELECT * FROM clients'),
      pool.query('SELECT * FROM alerts'),
    ]);

    const routers = routerResult.rows;
    const clients = clientResult.rows;
    const alerts = alertResult.rows;

    const online = routers.filter(r => r.status === 'online').length;
    const offline = routers.length - online;
    const totalTraffic = routers.reduce((s, r) => s + parseFloat(r.traffic_in || 0) + parseFloat(r.traffic_out || 0), 0);

    const active = clients.filter(c => c.status === 'active').length;
    const totalBandwidth = clients.reduce((s, c) => s + parseFloat(c.bandwidth || 0), 0);

    const critical = alerts.filter(a => a.type === 'critical' && !a.acknowledged).length;
    const warning = alerts.filter(a => a.type === 'warning' && !a.acknowledged).length;
    const unacknowledged = alerts.filter(a => !a.acknowledged).length;

    res.json({
      routers: {
        total: routers.length,
        online,
        offline,
        totalTraffic: totalTraffic.toFixed(2) + ' Gbps',
      },
      clients: {
        total: clients.length,
        active,
        suspended: clients.length - active,
        totalBandwidth: totalBandwidth.toFixed(1) + ' Mbps',
      },
      alerts: { critical, warning, unacknowledged },
      bandwidth: { inbound: '0.0 Gbps', outbound: '0.0 Gbps' },
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
