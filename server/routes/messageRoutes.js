import express from 'express';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Message from '../models/Message.js';
import { adminAuth } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const messagesFilePath = path.join(__dirname, '../data/messages.json');

function readBackupMessages() {
  try {
    if (fs.existsSync(messagesFilePath)) {
      return JSON.parse(fs.readFileSync(messagesFilePath, 'utf-8'));
    }
  } catch (err) {
    console.error('Error reading backup messages file:', err);
  }
  return [];
}

function writeBackupMessages(messages) {
  try {
    fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing backup messages file:', err);
    return false;
  }
}

const router = express.Router();

// PUBLIC — contact form submit
router.post('/', async (req, res) => {
  const { name, email, message, subject } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  const payload = {
    name: String(name).trim(),
    email: String(email).trim(),
    subject: subject ? String(subject).trim() : 'General Inquiry',
    message: String(message).trim(),
    read: false,
  };

  // 1. If MongoDB is connected, attempt to save to MongoDB
  if (mongoose.connection.readyState === 1) {
    try {
      const msg = await Message.create(payload);
      const backupList = readBackupMessages();
      backupList.unshift(msg.toObject ? msg.toObject() : msg);
      writeBackupMessages(backupList.slice(0, 500));
      return res.status(201).json(msg);
    } catch (err) {
      console.warn('MongoDB message create error, falling back to local file:', err.message);
    }
  }

  // 2. Offline fallback storage
  const offlineMsg = {
    _id: 'msg_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
    ...payload,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const backupList = readBackupMessages();
  backupList.unshift(offlineMsg);
  writeBackupMessages(backupList.slice(0, 500));

  res.status(201).json(offlineMsg);
});

// ADMIN — list messages
router.get('/', adminAuth, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const dbMessages = await Message.find().sort({ createdAt: -1 }).lean();
      const fileMessages = readBackupMessages();

      const dbIdSet = new Set(dbMessages.map((m) => String(m._id)));
      const merged = [...dbMessages];
      for (const m of fileMessages) {
        if (!dbIdSet.has(String(m._id))) {
          merged.push(m);
        }
      }
      merged.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      return res.json(merged);
    }
  } catch (err) {
    console.warn('MongoDB message read error, using local fallback:', err.message);
  }

  const fileMessages = readBackupMessages();
  res.json(fileMessages);
});

// ADMIN — delete message
router.delete('/:id', adminAuth, async (req, res) => {
  const { id } = req.params;

  try {
    if (mongoose.connection.readyState === 1) {
      try {
        await Message.findByIdAndDelete(id);
      } catch {
        // ID might be an offline string ID
      }
    }
  } catch (err) {
    console.warn('MongoDB message delete error:', err.message);
  }

  const current = readBackupMessages();
  const filtered = current.filter((m) => String(m._id) !== String(id));
  writeBackupMessages(filtered);

  res.json({ success: true });
});

export default router;