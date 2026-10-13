import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Portfolio from '../models/Portfolio.js';
import Project from '../models/Project.js';
import Skill from '../models/Skill.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFilePath = path.join(__dirname, '../data/portfolioData.json');

export async function seedDatabase() {
  try {
    let initialData = null;
    if (fs.existsSync(dataFilePath)) {
      initialData = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
    }

    if (!initialData) {
      console.warn('⚠️ No initial portfolioData.json found to seed from.');
      return;
    }

    // 1. Seed Portfolio Singleton
    let portfolioDoc = await Portfolio.findOne({ slug: 'main' });
    if (!portfolioDoc) {
      portfolioDoc = await Portfolio.create({
        slug: 'main',
        home: initialData.home || {},
        about: initialData.about || {},
        skills: initialData.skills || {},
        projects: initialData.projects || {},
        contact: initialData.contact || {},
        footer: initialData.footer || {},
        security: initialData.security || { adminPin: '1234' },
      });
      console.log('✅ MongoDB: Portfolio master document seeded.');
    }

    // 2. Seed Projects Collection if empty
    const projectCount = await Project.countDocuments();
    if (projectCount === 0 && Array.isArray(initialData.projects?.items)) {
      const projectDocs = initialData.projects.items.map((p, idx) => ({
        projectId: p.id || `p-${idx}`,
        name: p.name || 'Untitled Project',
        title: p.name || 'Untitled Project',
        category: p.category || 'web',
        desc: p.desc || '',
        description: p.desc || '',
        tags: Array.isArray(p.tags) ? p.tags : [],
        techStack: Array.isArray(p.tags) ? p.tags : [],
        imageKey: p.imageKey || '',
        imageUrl: p.imageUrl || '',
        alt: p.alt || '',
        repo: p.repo || '',
        githubLink: p.repo || '',
        demoUrl: p.demoUrl || '',
        liveLink: p.demoUrl || '',
        order: idx,
      }));

      await Project.insertMany(projectDocs);
      console.log(`✅ MongoDB: Seeded ${projectDocs.length} projects into Project collection.`);
    }

    // 3. Seed Skills Collection if empty
    const skillCount = await Skill.countDocuments();
    if (skillCount === 0 && Array.isArray(initialData.skills?.categories)) {
      const skillDocs = [];
      for (const cat of initialData.skills.categories) {
        if (Array.isArray(cat.items)) {
          for (const item of cat.items) {
            skillDocs.push({
              name: item,
              category: cat.name || 'Technical Skills',
              icon: cat.icon || 'Server',
              level: 85,
            });
          }
        }
      }

      if (skillDocs.length > 0) {
        await Skill.insertMany(skillDocs);
        console.log(`✅ MongoDB: Seeded ${skillDocs.length} skills into Skill collection.`);
      }
    }
  } catch (err) {
    console.error('❌ Error while seeding MongoDB:', err.message);
  }
}
