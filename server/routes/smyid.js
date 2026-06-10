import { Router } from 'express';
import pool from '../db/pool.js';
import auth from '../middleware/auth.js';
import { toSiteSummary, toMonthly } from '../utils.js';

const router = Router();

router.get('/overview', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM smyid_overview ORDER BY id DESC LIMIT 1');
    if (result.rowCount === 0) return res.json({ psb: 0, maintenance: 0, pembangunan: 0, dismantleBill: 0, bulan: '-', tahun: 0 });

    const r = result.rows[0];
    res.json({
      psb: Number(r.psb_total) || 0,
      maintenance: Number(r.mt_total) || 0,
      pembangunan: Number(r.pembangunan_total) || 0,
      dismantleBill: Number(r.dismantle_bill) || 0,
      bulan: r.bulan,
      tahun: Number(r.tahun) || 0,
    });
  } catch (err) {
    console.error('Get SMY.ID overview error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/site-summary', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM smyid_site_summary ORDER BY id');
    res.json(result.rows.map(toSiteSummary));
  } catch (err) {
    console.error('Get site summary error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/monthly/:category', auth, async (req, res) => {
  try {
    const { category } = req.params;
    const validCategories = ['psb', 'mt', 'pembangunan'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid category. Use: psb, mt, or pembangunan' });
    }

    const result = await pool.query(
      'SELECT * FROM smyid_monthly WHERE category = $1 ORDER BY id',
      [category]
    );
    res.json(result.rows.map(toMonthly));
  } catch (err) {
    console.error('Get monthly data error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
