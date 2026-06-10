import { Router } from 'express';
import pool from '../db/pool.js';
import auth from '../middleware/auth.js';
import { toClient } from '../utils.js';

const router = Router();

router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clients ORDER BY id');
    res.json(result.rows.map(toClient));
  } catch (err) {
    console.error('Get clients error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clients WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ message: 'Client not found' });
    res.json(toClient(result.rows[0]));
  } catch (err) {
    console.error('Get client error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { name, plan, ip, routerName, status, bandwidth, ping, contractEnd } = req.body;
    const result = await pool.query(
      `INSERT INTO clients (name, plan, ip, router_name, status, bandwidth, ping, contract_end)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [name, plan, ip, routerName, status || 'active', bandwidth || 0, ping || 0, contractEnd]
    );
    res.status(201).json(toClient(result.rows[0]));
  } catch (err) {
    console.error('Create client error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { name, plan, ip, routerName, status, bandwidth, ping, contractEnd } = req.body;
    const result = await pool.query(
      `UPDATE clients SET name=$1, plan=$2, ip=$3, router_name=$4, status=$5, bandwidth=$6, ping=$7, contract_end=$8
       WHERE id=$9 RETURNING *`,
      [name, plan, ip, routerName, status, bandwidth, ping, contractEnd, req.params.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ message: 'Client not found' });
    res.json(toClient(result.rows[0]));
  } catch (err) {
    console.error('Update client error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM clients WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ message: 'Client not found' });
    res.json({ success: true, id: Number(req.params.id) });
  } catch (err) {
    console.error('Delete client error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
