import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

app.use(express.json());

// Persistent directory for online data
const DATA_DIR = path.resolve(__dirname, 'data');
const GEMS_FILE = path.join(DATA_DIR, 'gems_counter.json');

// Online variable - starts at 0 as requested
let onlineGemsCount = 0;

try {
  if (fs.existsSync(GEMS_FILE)) {
    const raw = fs.readFileSync(GEMS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (typeof parsed.count === 'number' && !isNaN(parsed.count)) {
      onlineGemsCount = Math.max(0, Math.floor(parsed.count));
    }
  } else {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(
      GEMS_FILE,
      JSON.stringify({ count: 0, updatedAt: new Date().toISOString() })
    );
  }
} catch (e) {
  console.warn('[Server] Could not initialize gems file, starting from 0:', e);
}

function saveGemsCount() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(
      GEMS_FILE,
      JSON.stringify({ count: onlineGemsCount, updatedAt: new Date().toISOString() })
    );
  } catch (e) {
    console.warn('[Server] Error saving gems count:', e);
  }
}

// API: Get current online gems count
app.get('/api/gems', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.json({ count: onlineGemsCount });
});

// API: Increment online gems count (default 1)
app.post('/api/gems/increment', (req, res) => {
  const amount =
    typeof req.body?.amount === 'number' && req.body.amount > 0
      ? Math.min(50, Math.floor(req.body.amount))
      : 1;
  onlineGemsCount += amount;
  saveGemsCount();
  res.json({ count: onlineGemsCount, added: amount });
});

// API: Set online gems count
app.post('/api/gems/set', (req, res) => {
  if (typeof req.body?.count === 'number' && req.body.count >= 0) {
    onlineGemsCount = Math.floor(req.body.count);
    saveGemsCount();
    res.json({ count: onlineGemsCount });
  } else {
    res.status(400).json({ error: 'Invalid count' });
  }
});

// API: Reset to 0
app.post('/api/gems/reset', (req, res) => {
  onlineGemsCount = 0;
  saveGemsCount();
  res.json({ count: 0 });
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`[OLDBIJOU Hub] Server running at http://${HOST}:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Server Error]', err);
});
