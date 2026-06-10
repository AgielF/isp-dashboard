import { Router } from 'express';
import pool from '../db/pool.js';
import auth from '../middleware/auth.js';
import { toInvoice } from '../utils.js';

const router = Router();

router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM invoices ORDER BY issue_date DESC, id DESC');
    res.json(result.rows.map(toInvoice));
  } catch (err) {
    console.error('Get invoices error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/stats', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM invoices');
    const invoices = result.rows;

    const totalInvoiced = invoices.reduce((s, i) => s + Number(i.amount || 0), 0);
    const paid = invoices.filter(i => i.status === 'paid');
    const unpaid = invoices.filter(i => i.status === 'unpaid');
    const overdue = invoices.filter(i => i.status === 'overdue');

    res.json({
      totalInvoices: invoices.length,
      totalInvoiced,
      paidCount: paid.length,
      totalPaid: paid.reduce((s, i) => s + Number(i.amount || 0), 0),
      unpaidCount: unpaid.length,
      totalUnpaid: unpaid.reduce((s, i) => s + Number(i.amount || 0), 0),
      overdueCount: overdue.length,
      totalOverdue: overdue.reduce((s, i) => s + Number(i.amount || 0), 0),
    });
  } catch (err) {
    console.error('Get billing stats error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { id, client, plan, amount, status, issueDate, dueDate, paidDate, period } = req.body;
    const result = await pool.query(
      `INSERT INTO invoices (id, client_name, plan, amount, status, issue_date, due_date, paid_date, period)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [id, client, plan, amount || 0, status || 'unpaid', issueDate, dueDate, paidDate, period]
    );
    res.status(201).json(toInvoice(result.rows[0]));
  } catch (err) {
    console.error('Create invoice error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { client, plan, amount, status, issueDate, dueDate, paidDate, period } = req.body;
    const result = await pool.query(
      `UPDATE invoices SET client_name=$1, plan=$2, amount=$3, status=$4, issue_date=$5,
       due_date=$6, paid_date=$7, period=$8 WHERE id=$9 RETURNING *`,
      [client, plan, amount, status, issueDate, dueDate, paidDate, period, req.params.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ message: 'Invoice not found' });
    res.json(toInvoice(result.rows[0]));
  } catch (err) {
    console.error('Update invoice error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM invoices WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ message: 'Invoice not found' });
    res.json({ success: true, id: req.params.id });
  } catch (err) {
    console.error('Delete invoice error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
