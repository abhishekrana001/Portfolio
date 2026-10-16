import express from 'express';
import mongoose from 'mongoose';
import Skill from '../models/Skill.js';
import { adminAuth } from '../middleware/auth.js';

const router = express.Router();

// ─────────────────────────────────────────────────────────────
// PUBLIC — Get all skills
// Returns 503 with a clear JSON message when DB is not connected,
// instead of crashing with a raw Mongoose error (500).
// ─────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    console.warn('[/api/skills] MongoDB not connected (readyState=%d). Returning 503.', mongoose.connection.readyState);
    return res.status(503).json({
      error: 'Database not connected. Please try again shortly.',
      skills: [],
    });
  }

  try {
    const skills = await Skill.find().sort({ category: 1, name: 1 });
    res.json(skills);
  } catch (err) {
    // Log full error server-side; never expose raw DB error to the client
    console.error('[/api/skills] GET error:', err.message);
    res.status(500).json({ error: 'Failed to fetch skills. Please try again later.' });
  }
});

// ─────────────────────────────────────────────────────────────
// ADMIN — Create a skill
// ─────────────────────────────────────────────────────────────
router.post('/', adminAuth, async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: 'Database not connected.' });
  }
  try {
    const skill = await Skill.create(req.body);
    res.status(201).json(skill);
  } catch (err) {
    console.error('[/api/skills] POST error:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// ADMIN — Update a skill
// ─────────────────────────────────────────────────────────────
router.put('/:id', adminAuth, async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: 'Database not connected.' });
  }
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!skill) return res.status(404).json({ error: 'Skill not found.' });
    res.json(skill);
  } catch (err) {
    console.error('[/api/skills] PUT error:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// ADMIN — Delete a skill
// ─────────────────────────────────────────────────────────────
router.delete('/:id', adminAuth, async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: 'Database not connected.' });
  }
  try {
    const deleted = await Skill.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Skill not found.' });
    res.json({ success: true });
  } catch (err) {
    console.error('[/api/skills] DELETE error:', err.message);
    res.status(400).json({ error: err.message });
  }
});

export default router;