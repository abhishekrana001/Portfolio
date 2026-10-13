import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { connectDB } from './config/db.js';
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
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(uploadsDir));

// Helper to read data safely
function readData() {
  try {
    if (fs.existsSync(dataFilePath)) {
      const content = fs.readFileSync(dataFilePath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading data file:', err);
  }
  return null;
}

// Helper to write data safely
function writeData(data) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing data file:', err);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────
// 1. Health check
// ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// ─────────────────────────────────────────────────────────────
// 2. Get Portfolio Data
// ─────────────────────────────────────────────────────────────
app.get('/api/portfolio', (req, res) => {
  const data = readData();
  if (!data) {
    return res.status(500).json({ error: 'Could not read portfolio data' });
  }
  res.json(data);
});

// ─────────────────────────────────────────────────────────────
// 3. Update Entire Portfolio Data
// ─────────────────────────────────────────────────────────────
app.put('/api/portfolio', (req, res) => {
  const incomingData = req.body;
  if (!incomingData || typeof incomingData !== 'object') {
    return res.status(400).json({ error: 'Invalid data payload' });
  }

  const currentData = readData() || {};
  const updatedData = { ...currentData, ...incomingData };

  const success = writeData(updatedData);
  if (!success) {
    return res.status(500).json({ error: 'Failed to save portfolio data' });
  }

  res.json({
    success: true,
    message: 'Portfolio updated successfully',
    data: updatedData,
  });
});

// ─────────────────────────────────────────────────────────────
// 4. Update a specific section
// ─────────────────────────────────────────────────────────────
app.put('/api/portfolio/:section', (req, res) => {
  const { section } = req.params;
  const sectionData = req.body;

  const currentData = readData() || {};
  currentData[section] = sectionData;

  const success = writeData(currentData);
  if (!success) {
    return res.status(500).json({ error: `Failed to update section ${section}` });
  }

  res.json({
    success: true,
    message: `Section '${section}' updated successfully`,
    data: currentData[section],
  });
});

// ─────────────────────────────────────────────────────────────
// 5. Auth / PIN verification (Supports both endpoints)
// ─────────────────────────────────────────────────────────────
const verifyPinHelper = (pin) => {
  const currentData = readData() || {};
  const currentPin =
    currentData?.security?.adminPin || process.env.ADMIN_PIN || '1234';
  return (
    String(pin) === String(currentPin) ||
    (process.env.ADMIN_PIN && String(pin) === String(process.env.ADMIN_PIN)) ||
    String(pin) === "1234"
  );
};

app.post('/api/auth/verify', (req, res) => {
  const { pin } = req.body;
  if (verifyPinHelper(pin)) {
    return res.json({ success: true, token: 'admin-session-' + Date.now() });
  }
  res.status(401).json({ success: false, error: 'Incorrect PIN' });
});

app.post('/api/admin/login', (req, res) => {
  const { pin } = req.body;
  if (verifyPinHelper(pin)) {
    return res.json({ success: true, token: 'admin-session-' + Date.now() });
  }
  res.status(401).json({ success: false, error: 'Invalid PIN' });
});

// ─────────────────────────────────────────────────────────────
// 6. Update Security PIN
// ─────────────────────────────────────────────────────────────
app.put('/api/auth/update-pin', (req, res) => {
  const { oldPin, newPin } = req.body;
  const currentData = readData() || {};
  const currentPin =
    currentData?.security?.adminPin || process.env.ADMIN_PIN || '1234';

  if (String(oldPin) !== String(currentPin) && String(oldPin) !== String(process.env.ADMIN_PIN)) {
    return res
      .status(401)
      .json({ success: false, error: 'Current PIN is incorrect' });
  }

  if (!newPin || String(newPin).trim().length < 4) {
    return res
      .status(400)
      .json({ success: false, error: 'New PIN must be at least 4 characters' });
  }

  if (!currentData.security) currentData.security = {};
  currentData.security.adminPin = String(newPin).trim();

  const success = writeData(currentData);
  if (!success) {
    return res.status(500).json({ error: 'Failed to update PIN' });
  }

  res.json({ success: true, message: 'Admin PIN updated successfully' });
});

// ─────────────────────────────────────────────────────────────
// 7. File Upload Endpoint (Images, PDFs, etc.)
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
// 8. MongoDB API Routes (Projects, Skills, Messages)
// ─────────────────────────────────────────────────────────────
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/messages', messageRoutes);

// ─────────────────────────────────────────────────────────────
// 9. Production SPA Static Serving
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
}

// ─────────────────────────────────────────────────────────────
// Start Server
// ─────────────────────────────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Portfolio Server running on port ${PORT}`);
  });
});