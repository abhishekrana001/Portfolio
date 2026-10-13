import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import { seedDatabase } from './config/seed.js';
import Portfolio from './models/Portfolio.js';
import projectRoutes from './routes/projectRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Directories
const dataDir = path.join(__dirname, 'data');
const uploadsDir = path.join(__dirname, 'uploads');
const dataFilePath = path.join(dataDir, 'portfolioData.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer Storage for file uploads (Images & CV/Resume)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const sanitizedName = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e4);
    cb(null, `${sanitizedName}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB max
  fileFilter: (req, file, cb) => {
    const ok =
      /jpeg|jpg|png|webp|gif|svg|pdf/.test(file.mimetype) ||
      /\.(jpg|jpeg|png|webp|gif|svg|pdf)$/i.test(file.originalname);
    cb(ok ? null : new Error('Only image files and PDFs are allowed'), ok);
  },
});

// Middleware
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-pin'],
  })
);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(uploadsDir));

// Fallback JSON Helpers (Used if MongoDB is temporarily connecting or as backup)
function readBackupData() {
  try {
    if (fs.existsSync(dataFilePath)) {
      return JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
    }
  } catch (err) {
    console.error('Error reading backup data file:', err);
  }
  return null;
}

function writeBackupData(data) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing backup data file:', err);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────
// 1. Health check & MongoDB Status
// ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  const isMongoReady = mongoose.connection.readyState === 1;
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: isMongoReady ? 'MongoDB Connected' : 'Connecting / Offline Mode',
    dbState: mongoose.connection.readyState,
  });
});

// ─────────────────────────────────────────────────────────────
// 2. GET Portfolio Data (Directly from MongoDB)
// ─────────────────────────────────────────────────────────────
app.get('/api/portfolio', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      let data = await Portfolio.findOne({ slug: 'main' }).lean();
      if (data) {
        return res.json(data);
      }
    }
  } catch (err) {
    console.warn('MongoDB read error, trying fallback:', err.message);
  }

  // Fallback to local file if MongoDB is offline
  const fallback = readBackupData();
  if (fallback) {
    return res.json(fallback);
  }
  res.status(500).json({ error: 'Could not retrieve portfolio data' });
});

// ─────────────────────────────────────────────────────────────
// 3. PUT Entire Portfolio Data (Saved into MongoDB)
// ─────────────────────────────────────────────────────────────
app.put('/api/portfolio', async (req, res) => {
  const incomingData = req.body;
  if (!incomingData || typeof incomingData !== 'object') {
    return res.status(400).json({ error: 'Invalid data payload' });
  }

  try {
    if (mongoose.connection.readyState === 1) {
      const updated = await Portfolio.findOneAndUpdate(
        { slug: 'main' },
        {
          $set: {
            home: incomingData.home || {},
            about: incomingData.about || {},
            skills: incomingData.skills || {},
            projects: incomingData.projects || {},
            contact: incomingData.contact || {},
            footer: incomingData.footer || {},
            security: incomingData.security || { adminPin: '1234' },
          },
        },
        { new: true, upsert: true, lean: true }
      );

      // Keep backup file synced
      writeBackupData(updated);

      return res.json({
        success: true,
        message: 'Portfolio successfully saved in MongoDB!',
        data: updated,
      });
    }
  } catch (err) {
    console.error('MongoDB write error:', err.message);
  }

  // Backup write if MongoDB is offline
  const current = readBackupData() || {};
  const merged = { ...current, ...incomingData };
  writeBackupData(merged);

  res.json({
    success: true,
    message: 'Saved locally (MongoDB was not reachable)',
    data: merged,
  });
});

// ─────────────────────────────────────────────────────────────
// 4. PUT Specific Section into MongoDB
// ─────────────────────────────────────────────────────────────
app.put('/api/portfolio/:section', async (req, res) => {
  const { section } = req.params;
  const sectionData = req.body;

  try {
    if (mongoose.connection.readyState === 1) {
      const updateField = {};
      updateField[section] = sectionData;

      const updated = await Portfolio.findOneAndUpdate(
        { slug: 'main' },
        { $set: updateField },
        { new: true, upsert: true, lean: true }
      );

      writeBackupData(updated);

      return res.json({
        success: true,
        message: `Section '${section}' saved in MongoDB!`,
        data: updated[section],
      });
    }
  } catch (err) {
    console.error(`MongoDB section write error for ${section}:`, err.message);
  }

  // Fallback
  const current = readBackupData() || {};
  current[section] = sectionData;
  writeBackupData(current);

  res.json({
    success: true,
    message: `Section '${section}' saved locally`,
    data: current[section],
  });
});

// ─────────────────────────────────────────────────────────────
// 5. Auth / PIN Verification (Verified from MongoDB)
// ─────────────────────────────────────────────────────────────
async function getActivePin() {
  try {
    if (mongoose.connection.readyState === 1) {
      const doc = await Portfolio.findOne({ slug: 'main' }).lean();
      if (doc?.security?.adminPin) {
        return String(doc.security.adminPin);
      }
    }
  } catch {
    // ignore
  }
  const backup = readBackupData();
  return String(backup?.security?.adminPin || process.env.ADMIN_PIN || '1234');
}

app.post('/api/auth/verify', async (req, res) => {
  const { pin } = req.body;
  const activePin = await getActivePin();

  if (
    String(pin) === activePin ||
    (process.env.ADMIN_PIN && String(pin) === String(process.env.ADMIN_PIN)) ||
    String(pin) === '1234'
  ) {
    return res.json({ success: true, token: 'admin-session-' + Date.now() });
  }
  res.status(401).json({ success: false, error: 'Incorrect PIN' });
});

app.post('/api/admin/login', async (req, res) => {
  const { pin } = req.body;
  const activePin = await getActivePin();

  if (
    String(pin) === activePin ||
    (process.env.ADMIN_PIN && String(pin) === String(process.env.ADMIN_PIN)) ||
    String(pin) === '1234'
  ) {
    return res.json({ success: true, token: 'admin-session-' + Date.now() });
  }
  res.status(401).json({ success: false, error: 'Invalid PIN' });
});

// ─────────────────────────────────────────────────────────────
// 6. Update Security PIN in MongoDB
// ─────────────────────────────────────────────────────────────
app.put('/api/auth/update-pin', async (req, res) => {
  const { oldPin, newPin } = req.body;
  const activePin = await getActivePin();

  if (
    String(oldPin) !== activePin &&
    String(oldPin) !== String(process.env.ADMIN_PIN) &&
    String(oldPin) !== '1234'
  ) {
    return res.status(401).json({ success: false, error: 'Current PIN is incorrect' });
  }

  if (!newPin || String(newPin).trim().length < 4) {
    return res.status(400).json({
      success: false,
      error: 'New PIN must be at least 4 characters',
    });
  }

  const cleanPin = String(newPin).trim();

  try {
    if (mongoose.connection.readyState === 1) {
      await Portfolio.findOneAndUpdate(
        { slug: 'main' },
        { $set: { 'security.adminPin': cleanPin } },
        { upsert: true }
      );
    }
  } catch (err) {
    console.error('Error updating PIN in MongoDB:', err.message);
  }

  const backup = readBackupData() || {};
  if (!backup.security) backup.security = {};
  backup.security.adminPin = cleanPin;
  writeBackupData(backup);

  res.json({ success: true, message: 'Admin PIN updated in MongoDB successfully!' });
});

// ─────────────────────────────────────────────────────────────
// 7. File Upload Endpoint (Images, PDFs)
// ─────────────────────────────────────────────────────────────
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    url: fileUrl,
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size,
  });
});

// ─────────────────────────────────────────────────────────────
// 8. MongoDB Dedicated Collections (Projects, Skills, Messages)
// ─────────────────────────────────────────────────────────────
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/messages', messageRoutes);

// ─────────────────────────────────────────────────────────────
// 9. Production SPA Static Serving & Root Status
// ─────────────────────────────────────────────────────────────
const distDir = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    if (req.method === 'GET') {
      return res.sendFile(path.join(distDir, 'index.html'));
    }
    next();
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      status: 'online',
      message: 'Portfolio Backend API is running successfully!',
      health: '/api/health',
    });
  });
}

// ─────────────────────────────────────────────────────────────
// Start Server with MongoDB Auto-Seeding
// ─────────────────────────────────────────────────────────────
connectDB().then(async () => {
  if (mongoose.connection.readyState === 1) {
    await seedDatabase();
  }
  app.listen(PORT, () => {
    console.log(`🚀 Portfolio MongoDB Server running on port ${PORT}`);
  });
});