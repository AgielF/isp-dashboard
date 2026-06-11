import { Router } from 'express';
import pool from '../db/pool.js';
import auth, { requireRole } from '../middleware/auth.js';
import { toRouter } from '../utils.js';

const router = Router();

router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM routers ORDER BY id');
    res.json(result.rows.map(toRouter));
  } catch (err) {
    console.error('Get routers error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM routers WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ message: 'Router not found' });
    res.json(toRouter(result.rows[0]));
  } catch (err) {
    console.error('Get router error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, requireRole('admin', 'operator'), async (req, res) => {
  try {
    const { name, location, ip, status, cpu, memory, uptime, trafficIn, trafficOut } = req.body;
    const result = await pool.query(
      `INSERT INTO routers (name, location, ip, status, cpu, memory, uptime, traffic_in, traffic_out, last_seen)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW()) RETURNING *`,
      [name, location, ip, status || 'online', cpu || 0, memory || 0, uptime || '0d 0h 0m', trafficIn || 0, trafficOut || 0]
    );
    res.status(201).json(toRouter(result.rows[0]));
  } catch (err) {
    console.error('Create router error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, requireRole('admin', 'operator'), async (req, res) => {
  try {
    const { name, location, ip, status, cpu, memory, uptime, trafficIn, trafficOut } = req.body;
    const result = await pool.query(
      `UPDATE routers SET name=$1, location=$2, ip=$3, status=$4, cpu=$5, memory=$6, uptime=$7, traffic_in=$8, traffic_out=$9, last_seen=NOW()
       WHERE id=$10 RETURNING *`,
      [name, location, ip, status, cpu, memory, uptime, trafficIn || 0, trafficOut || 0, req.params.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ message: 'Router not found' });
    res.json(toRouter(result.rows[0]));
  } catch (err) {
    console.error('Update router error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM routers WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ message: 'Router not found' });
    res.json({ success: true, id: Number(req.params.id) });
  } catch (err) {
    console.error('Delete router error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
