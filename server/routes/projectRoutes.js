const express = require('express');
const router = express.Router();
const validator = require('validator');
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// GET /api/projects - Get all projects (public: active only; admin: all — requires auth)
router.get('/', async (req, res) => {
  try {
    let filter = { isActive: { $ne: false } };
    if (req.query.admin === 'true') {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication required for admin access.' });
      }
      try {
        const jwt = require('jsonwebtoken');
        jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
        filter = {};
      } catch (e) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
      }
    }
    const projects = await Project.find(filter).sort({ displayOrder: 1, createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/projects - Create a new project (protected)
router.post('/', auth, async (req, res) => {
  if (!req.body.title || !req.body.description) {
    return res.status(400).json({ message: 'Title and description are required.' });
  }

  try {
    const newProject = new Project({
      title: validator.trim(String(req.body.title)).substring(0, 200),
      description: validator.trim(String(req.body.description)).substring(0, 5000),
      imageUrl: req.body.imageUrl ? validator.trim(String(req.body.imageUrl)).substring(0, 2000) : undefined,
      techStack: Array.isArray(req.body.techStack) ? req.body.techStack.map(t => validator.trim(String(t)).substring(0, 100)) : [],
      link: req.body.link ? validator.trim(String(req.body.link)).substring(0, 2000) : undefined,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true
    });
    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create project.' });
  }
});

// PUT /api/projects/:id - Update a project (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });

    if (req.body.title != null) project.title = validator.trim(String(req.body.title)).substring(0, 200);
    if (req.body.description != null) project.description = validator.trim(String(req.body.description)).substring(0, 5000);
    if (req.body.imageUrl != null) project.imageUrl = validator.trim(String(req.body.imageUrl)).substring(0, 2000);
    if (req.body.techStack != null) project.techStack = Array.isArray(req.body.techStack) ? req.body.techStack.map(t => validator.trim(String(t)).substring(0, 100)) : [];
    if (req.body.link != null) project.link = validator.trim(String(req.body.link)).substring(0, 2000);
    if (req.body.isActive !== undefined) project.isActive = req.body.isActive;

    const updatedProject = await project.save();
    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update project.' });
  }
});

// DELETE /api/projects/:id - Delete a project (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    await project.deleteOne();
    res.status(200).json({ message: 'Project deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
