const express = require('express');
const router = express.Router();
const validator = require('validator');
const Service = require('../models/Service');
const auth = require('../middleware/auth');

// Get all services (public: active only; admin: all — requires auth)
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
    const services = await Service.find(filter).sort({ displayOrder: 1, createdAt: -1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Create a service (protected)
router.post('/', auth, async (req, res) => {
  if (!req.body.title || !req.body.description) {
    return res.status(400).json({ message: 'Title and description are required.' });
  }

  const service = new Service({
    title: validator.trim(String(req.body.title)).substring(0, 200),
    description: validator.trim(String(req.body.description)).substring(0, 5000),
    features: Array.isArray(req.body.features) ? req.body.features.map(f => validator.trim(String(f)).substring(0, 200)) : [],
    tech: Array.isArray(req.body.tech) ? req.body.tech.map(t => validator.trim(String(t)).substring(0, 100)) : [],
    process: Array.isArray(req.body.process) ? req.body.process.map(p => validator.trim(String(p)).substring(0, 200)) : [],
    isActive: req.body.isActive !== undefined ? req.body.isActive : true
  });
  try {
    const newService = await service.save();
    res.status(201).json(newService);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create service.' });
  }
});

// Update a service (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }

    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found.' });

    if (req.body.title != null) service.title = validator.trim(String(req.body.title)).substring(0, 200);
    if (req.body.description != null) service.description = validator.trim(String(req.body.description)).substring(0, 5000);
    if (req.body.features != null) service.features = Array.isArray(req.body.features) ? req.body.features.map(f => validator.trim(String(f)).substring(0, 200)) : [];
    if (req.body.tech != null) service.tech = Array.isArray(req.body.tech) ? req.body.tech.map(t => validator.trim(String(t)).substring(0, 100)) : [];
    if (req.body.process != null) service.process = Array.isArray(req.body.process) ? req.body.process.map(p => validator.trim(String(p)).substring(0, 200)) : [];
    if (req.body.isActive !== undefined) service.isActive = req.body.isActive;

    const updatedService = await service.save();
    res.json(updatedService);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update service.' });
  }
});

// Delete a service (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }

    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found.' });
    await service.deleteOne();
    res.json({ message: 'Service deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
