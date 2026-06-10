import { Router } from 'express';
import pool from '../db/pool.js';
import auth from '../middleware/auth.js';
import { toAlert } from '../utils.js';

const router = Router();

router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM alerts ORDER BY timestamp DESC');
    res.json(result.rows.map(toAlert));
  } catch (err) {
    console.error('Get alerts error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/stats', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM alerts');
    const alerts = result.rows;

    const critical = alerts.filter(a => a.type === 'critical' && !a.acknowledged).length;
    const warning = alerts.filter(a => a.type === 'warning' && !a.acknowledged).length;
    const unacknowledged = alerts.filter(a => !a.acknowledged).length;

    res.json({ critical, warning, unacknowledged });
  } catch (err) {
    console.error('Get alert stats error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { type, message, routerName } = req.body;
    const result = await pool.query(
      `INSERT INTO alerts (type, message, router_name, timestamp, acknowledged)
       VALUES ($1, $2, $3, NOW(), FALSE) RETURNING *`,
      [type || 'info', message, routerName]
    );
    res.status(201).json(toAlert(result.rows[0]));
  } catch (err) {
    console.error('Create alert error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id/ack', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE alerts SET acknowledged = TRUE WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ message: 'Alert not found' });
    res.json(toAlert(result.rows[0]));
  } catch (err) {
    console.error('Acknowledge alert error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
