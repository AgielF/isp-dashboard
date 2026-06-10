import { Router } from 'express';
import auth from '../middleware/auth.js';

const router = Router();

// Generate bandwidth history (24h, 5-min intervals) on the server
// This is display data that refreshes naturally
router.get('/history', auth, (req, res) => {
  const hours = 24;
  const data = [];
  const now = new Date();
  const points = hours * 12; // every 5 minutes

  // Use hour-based seed for consistent data within the same hour
  const seed = Math.floor(now.getTime() / 3600000);

  function seededRandom(i) {
    const x = Math.sin(seed + i * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  }

  for (let i = points; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 5 * 60 * 1000);
    const hour = time.getHours();

    const baseLoad = hour >= 8 && hour <= 22 ? 60 : 25;
    const variance = (seededRandom(i) - 0.5) * 30;

    data.push({
      time: time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      timestamp: time.toISOString(),
      inbound: Math.max(5, baseLoad + variance + seededRandom(i + 1000) * 10),
      outbound: Math.max(3, (baseLoad + variance) * 0.7 + seededRandom(i + 2000) * 8),
    });
  }

  res.json(data);
});

export default router;
