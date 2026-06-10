import { Router } from 'express';
import pool from '../db/pool.js';
import auth from '../middleware/auth.js';
import { toInstallation } from '../utils.js';

const router = Router();

router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM installations ORDER BY id DESC');
    res.json(result.rows.map(toInstallation));
  } catch (err) {
    console.error('Get installations error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { clientName, address, plan, technician, status, scheduledDate, completedDate, notes } = req.body;
    const result = await pool.query(
      `INSERT INTO installations (client_name, address, plan, technician, status, scheduled_date, completed_date, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [clientName, address, plan, technician, status || 'pending', scheduledDate, completedDate, notes]
    );
    res.status(201).json(toInstallation(result.rows[0]));
  } catch (err) {
    console.error('Create installation error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { clientName, address, plan, technician, status, scheduledDate, completedDate, notes } = req.body;
    const result = await pool.query(
      `UPDATE installations SET client_name=$1, address=$2, plan=$3, technician=$4, status=$5,
       scheduled_date=$6, completed_date=$7, notes=$8 WHERE id=$9 RETURNING *`,
      [clientName, address, plan, technician, status, scheduledDate, completedDate, notes, req.params.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ message: 'Installation not found' });
    res.json(toInstallation(result.rows[0]));
  } catch (err) {
    console.error('Update installation error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM installations WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ message: 'Installation not found' });
    res.json({ success: true, id: Number(req.params.id) });
  } catch (err) {
    console.error('Delete installation error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
