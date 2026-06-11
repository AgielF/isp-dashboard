import { Router } from 'express';
import pool from '../db/pool.js';
import auth, { requireRole } from '../middleware/auth.js';
import { toMaintenance } from '../utils.js';

const router = Router();

router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM maintenance_logs ORDER BY id DESC');
    res.json(result.rows.map(toMaintenance));
  } catch (err) {
    console.error('Get maintenance error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, requireRole('admin', 'operator'), async (req, res) => {
  try {
    const { routerName, type, description, technician, status, startDate, endDate, duration } = req.body;
    const result = await pool.query(
      `INSERT INTO maintenance_logs (router_name, type, description, technician, status, start_date, end_date, duration)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [routerName, type || 'preventive', description, technician, status || 'scheduled', startDate, endDate, duration]
    );
    res.status(201).json(toMaintenance(result.rows[0]));
  } catch (err) {
    console.error('Create maintenance error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, requireRole('admin', 'operator', 'technician'), async (req, res) => {
  try {
    const { routerName, type, description, technician, status, startDate, endDate, duration } = req.body;
    const result = await pool.query(
      `UPDATE maintenance_logs SET router_name=$1, type=$2, description=$3, technician=$4, status=$5,
       start_date=$6, end_date=$7, duration=$8 WHERE id=$9 RETURNING *`,
      [routerName, type, description, technician, status, startDate, endDate, duration, req.params.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ message: 'Maintenance log not found' });
    res.json(toMaintenance(result.rows[0]));
  } catch (err) {
    console.error('Update maintenance error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM maintenance_logs WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ message: 'Maintenance log not found' });
    res.json({ success: true, id: Number(req.params.id) });
  } catch (err) {
    console.error('Delete maintenance error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
