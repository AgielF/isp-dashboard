import { Router } from 'express';
import pool from '../db/pool.js';
import auth, { requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/revenue', auth, requireRole('admin', 'finance'), async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM monthly_revenue ORDER BY id');
    res.json(result.rows.map(r => ({
      month: r.month,
      revenue: Number(r.revenue) || 0,
      target: Number(r.target) || 0,
    })));
  } catch (err) {
    console.error('Get revenue error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/by-plan', auth, requireRole('admin', 'finance'), async (req, res) => {
  try {
    // Aggregate revenue from invoices grouped by plan
    const result = await pool.query(`
      SELECT plan, SUM(amount) as total, COUNT(*) as clients
      FROM invoices WHERE status = 'paid'
      GROUP BY plan ORDER BY total DESC
    `);
    res.json(result.rows.map(r => ({
      name: r.plan,
      value: Number(r.total) || 0,
      clients: Number(r.clients) || 0,
    })));
  } catch (err) {
    console.error('Get revenue by plan error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/top-clients', auth, requireRole('admin', 'finance'), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT client_name, plan,
        SUM(amount) as total_paid,
        MAX(amount) as monthly_revenue
      FROM invoices WHERE status = 'paid'
      GROUP BY client_name, plan
      ORDER BY total_paid DESC
    `);
    res.json(result.rows.map(r => ({
      name: r.client_name,
      plan: r.plan,
      monthlyRevenue: Number(r.monthly_revenue) || 0,
      totalPaid: Number(r.total_paid) || 0,
    })));
  } catch (err) {
    console.error('Get top clients error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/stats', auth, requireRole('admin', 'finance'), async (req, res) => {
  try {
    const revenueResult = await pool.query('SELECT * FROM monthly_revenue ORDER BY id');
    const rows = revenueResult.rows;

    const totalRevenue = rows.reduce((s, r) => s + Number(r.revenue || 0), 0);
    const totalTarget = rows.reduce((s, r) => s + Number(r.target || 0), 0);
    const currentMonth = rows[rows.length - 1];
    const lastMonth = rows[rows.length - 2];

    const growth = currentMonth && lastMonth
      ? (((Number(currentMonth.revenue) - Number(lastMonth.revenue)) / Number(lastMonth.revenue)) * 100).toFixed(1)
      : 0;

    // Get outstanding from unpaid+overdue invoices
    const outstandingResult = await pool.query(
      "SELECT COALESCE(SUM(amount), 0) as outstanding FROM invoices WHERE status IN ('unpaid', 'overdue')"
    );
    const outstanding = Number(outstandingResult.rows[0].outstanding) || 0;

    res.json({
      totalRevenue,
      totalTarget,
      currentMonthRevenue: currentMonth ? Number(currentMonth.revenue) : 0,
      monthlyTarget: currentMonth ? Number(currentMonth.target) : 0,
      growth: parseFloat(growth),
      outstanding,
      collectionRate: totalRevenue > 0
        ? (((totalRevenue - outstanding) / totalRevenue) * 100).toFixed(1)
        : '0.0',
    });
  } catch (err) {
    console.error('Get financial stats error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
