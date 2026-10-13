import express from 'express';
import Project from '../models/Project.js';
import { adminAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// PUBLIC — Get all projects from MongoDB
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUBLIC — Get single project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN ONLY — Create new project in MongoDB
router.post('/', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.techStack && typeof data.techStack === 'string') {
      data.techStack = data.techStack.split(',').map((s) => s.trim());
      data.tags = data.techStack;
    }
    if (req.file) data.imageUrl = `/uploads/${req.file.filename}`;

    const project = await Project.create(data);
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ADMIN ONLY — Update project in MongoDB
router.put('/:id', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.techStack && typeof data.techStack === 'string') {
      data.techStack = data.techStack.split(',').map((s) => s.trim());
      data.tags = data.techStack;
    }
    if (req.file) data.imageUrl = `/uploads/${req.file.filename}`;

    const project = await Project.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ADMIN ONLY — Delete project from MongoDB
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ success: true, message: 'Project deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;