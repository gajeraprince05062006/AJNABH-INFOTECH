const express = require('express');
const router = express.Router();
const validator = require('validator');
const TeamMember = require('../models/TeamMember');
const auth = require('../middleware/auth');

// Get all team members (public: active only; admin: all — requires auth)
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
    const members = await TeamMember.find(filter).sort({ displayOrder: 1, createdAt: 1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Create a team member (protected)
router.post('/', auth, async (req, res) => {
  if (!req.body.name || !req.body.role) {
    return res.status(400).json({ message: 'Name and role are required.' });
  }

  const socialLinks = {};
  if (req.body.socialLinks) {
    if (req.body.socialLinks.linkedin) socialLinks.linkedin = validator.trim(String(req.body.socialLinks.linkedin)).substring(0, 500);
    if (req.body.socialLinks.twitter) socialLinks.twitter = validator.trim(String(req.body.socialLinks.twitter)).substring(0, 500);
    if (req.body.socialLinks.github) socialLinks.github = validator.trim(String(req.body.socialLinks.github)).substring(0, 500);
  }

  const member = new TeamMember({
    name: validator.trim(String(req.body.name)).substring(0, 100),
    role: validator.trim(String(req.body.role)).substring(0, 100),
    skills: Array.isArray(req.body.skills) ? req.body.skills.map(s => validator.trim(String(s)).substring(0, 100)) : [],
    experience: req.body.experience ? validator.trim(String(req.body.experience)).substring(0, 200) : undefined,
    socialLinks,
    imageUrl: req.body.imageUrl ? validator.trim(String(req.body.imageUrl)).substring(0, 2000) : undefined,
    isActive: req.body.isActive !== undefined ? req.body.isActive : true
  });
  try {
    const newMember = await member.save();
    res.status(201).json(newMember);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create team member.' });
  }
});

// Update a team member (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }

    const member = await TeamMember.findById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Team member not found.' });

    if (req.body.name != null) member.name = validator.trim(String(req.body.name)).substring(0, 100);
    if (req.body.role != null) member.role = validator.trim(String(req.body.role)).substring(0, 100);
    if (req.body.skills != null) member.skills = Array.isArray(req.body.skills) ? req.body.skills.map(s => validator.trim(String(s)).substring(0, 100)) : [];
    if (req.body.experience != null) member.experience = validator.trim(String(req.body.experience)).substring(0, 200);
    if (req.body.socialLinks != null) {
      const sl = {};
      if (req.body.socialLinks.linkedin) sl.linkedin = validator.trim(String(req.body.socialLinks.linkedin)).substring(0, 500);
      if (req.body.socialLinks.twitter) sl.twitter = validator.trim(String(req.body.socialLinks.twitter)).substring(0, 500);
      if (req.body.socialLinks.github) sl.github = validator.trim(String(req.body.socialLinks.github)).substring(0, 500);
      member.socialLinks = sl;
    }
    if (req.body.imageUrl != null) member.imageUrl = validator.trim(String(req.body.imageUrl)).substring(0, 2000);
    if (req.body.isActive !== undefined) member.isActive = req.body.isActive;

    const updatedMember = await member.save();
    res.json(updatedMember);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update team member.' });
  }
});

// Delete a team member (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }

    const member = await TeamMember.findById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Team member not found.' });
    await member.deleteOne();
    res.json({ message: 'Team member deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
