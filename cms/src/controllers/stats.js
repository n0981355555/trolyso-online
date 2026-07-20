import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STATS_FILE = path.resolve(__dirname, '../../public/stats-data.json');

// Helper to hash a string into a deterministic number
function hashSlug(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Get baseline seed count for realistic display
function getBaseline(slug, type) {
  const hash = hashSlug(slug);
  if (type === 'tool' || type === 'calculator') {
    return 2500 + (hash % 8500); // 2,500 - 11,000 lượt dùng
  }
  return 800 + (hash % 3500); // 800 - 4,300 lượt đọc
}

// Load stats from JSON file
function loadStats() {
  try {
    if (fs.existsSync(STATS_FILE)) {
      const data = fs.readFileSync(STATS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading stats file:', err);
  }
  return { tools: {}, posts: {} };
}

// Save stats to JSON file
function saveStats(stats) {
  try {
    const dir = path.dirname(STATS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving stats file:', err);
  }
}

// GET /api/stats
export const getStats = (req, res) => {
  const stats = loadStats();
  res.json({
    success: true,
    data: stats
  });
};

// GET /api/stats/:slug
export const getSingleStat = (req, res) => {
  const { slug } = req.params;
  const { type = 'post' } = req.query;
  const stats = loadStats();
  
  const group = (type === 'tool' || type === 'calculator') ? 'tools' : 'posts';
  const customCount = stats[group]?.[slug] || 0;
  const baseCount = getBaseline(slug, type);
  const total = baseCount + customCount;

  res.json({
    success: true,
    slug,
    type,
    count: total,
    formatted: total >= 1000 ? `${(total / 1000).toFixed(1)}k+` : `${total}`
  });
};

// POST /api/stats/increment
export const incrementStat = (req, res) => {
  const { slug, type = 'post' } = req.body;
  if (!slug) {
    return res.status(400).json({ success: false, message: 'Slug là bắt buộc' });
  }

  const stats = loadStats();
  const group = (type === 'tool' || type === 'calculator') ? 'tools' : 'posts';
  
  if (!stats[group]) {
    stats[group] = {};
  }

  stats[group][slug] = (stats[group][slug] || 0) + 1;
  saveStats(stats);

  const baseCount = getBaseline(slug, type);
  const total = baseCount + stats[group][slug];

  res.json({
    success: true,
    slug,
    type,
    count: total,
    formatted: total >= 1000 ? `${(total / 1000).toFixed(1)}k+` : `${total}`
  });
};
