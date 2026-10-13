import express from 'express';
import Project from '../models/Project.js';
import { adminAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// PUBLIC — website ye use karegi
router.get('/', async (req, res) => {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
});

router.get('/:id', async (req, res) => {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Not found' });
    res.json(project);
});

// ADMIN ONLY
router.post('/', adminAuth, upload.single('image'), async (req, res) => {
    try {
        const data = { ...req.body };
        if (data.techStack && typeof data.techStack === 'string') {
            data.techStack = data.techStack.split(',').map(s => s.trim());
        }
        if (req.file) data.imageUrl = `/uploads/${req.file.filename}`;

        const project = await Project.create(data);
        res.status(201).json(project);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.put('/:id', adminAuth, upload.single('image'), async (req, res) => {
    const data = { ...req.body };
    if (data.techStack && typeof data.techStack === 'string') {
        data.techStack = data.techStack.split(',').map(s => s.trim());
    }
    if (req.file) data.imageUrl = `/uploads/${req.file.filename}`;

    const project = await Project.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(project);
});

router.delete('/:id', adminAuth, async (req, res) => {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

export default router;