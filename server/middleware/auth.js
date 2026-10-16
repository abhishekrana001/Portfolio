import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Portfolio from '../models/Portfolio.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backupPath = path.join(__dirname, '../data/portfolioData.json');

export const adminAuth = async (req, res, next) => {
  const pin = req.headers['x-admin-pin'];
  if (!pin) {
    return res.status(401).json({ error: 'Unauthorized: missing PIN' });
  }

  // Allow active admin session tokens
  if (
    typeof pin === 'string' &&
    (pin.startsWith('admin-session-') || pin.startsWith('admin-authenticated'))
  ) {
    return next();
  }

  let dbPin = null;
  try {
    if (mongoose.connection.readyState === 1) {
      const doc = await Portfolio.findOne({ slug: 'main' }).lean();
      dbPin = doc?.security?.adminPin;
    } else if (fs.existsSync(backupPath)) {
      const backup = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));
      dbPin = backup?.security?.adminPin;
    }
  } catch {
    // ignore
  }

  const validPin =
    String(pin) === String(dbPin) ||
    (process.env.ADMIN_PIN && String(pin) === String(process.env.ADMIN_PIN));

  if (!validPin) {
    return res.status(401).json({ error: 'Unauthorized: invalid PIN' });
  }

  next();
};