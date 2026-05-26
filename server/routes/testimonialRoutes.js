const express = require('express');
const router = express.Router();
const validator = require('validator');
const Testimonial = require('../models/Testimonial');
const auth = require('../middleware/auth');

// Get all testimonials (public: active only; admin: all — requires auth)
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
    const testimonials = await Testimonial.find(filter).sort({ displayOrder: 1, createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Create a testimonial (protected)
router.post('/', auth, async (req, res) => {
  if (!req.body.clientName || !req.body.company || !req.body.review) {
    return res.status(400).json({ message: 'Client name, company, and review are required.' });
  }

  const rating = Number(req.body.rating);
  if (req.body.rating != null && (isNaN(rating) || rating < 1 || rating > 5)) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
  }

  const testimonial = new Testimonial({
    clientName: validator.trim(String(req.body.clientName)).substring(0, 100),
    company: validator.trim(String(req.body.company)).substring(0, 100),
    review: validator.trim(String(req.body.review)).substring(0, 5000),
    rating: rating || 5,
    imageUrl: req.body.imageUrl ? validator.trim(String(req.body.imageUrl)).substring(0, 2000) : undefined,
    isActive: req.body.isActive !== undefined ? req.body.isActive : true
  });
  try {
    const newTestimonial = await testimonial.save();
    res.status(201).json(newTestimonial);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create testimonial.' });
  }
});

// Update a testimonial (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }

    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ message: 'Testimonial not found.' });

    if (req.body.clientName != null) testimonial.clientName = validator.trim(String(req.body.clientName)).substring(0, 100);
    if (req.body.company != null) testimonial.company = validator.trim(String(req.body.company)).substring(0, 100);
    if (req.body.review != null) testimonial.review = validator.trim(String(req.body.review)).substring(0, 5000);
    if (req.body.rating != null) {
      const rating = Number(req.body.rating);
      if (!isNaN(rating) && rating >= 1 && rating <= 5) {
        testimonial.rating = rating;
      }
    }
    if (req.body.imageUrl != null) testimonial.imageUrl = validator.trim(String(req.body.imageUrl)).substring(0, 2000);
    if (req.body.isActive !== undefined) testimonial.isActive = req.body.isActive;

    const updatedTestimonial = await testimonial.save();
    res.json(updatedTestimonial);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update testimonial.' });
  }
});

// Delete a testimonial (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }

    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ message: 'Testimonial not found.' });
    await testimonial.deleteOne();
    res.json({ message: 'Testimonial deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
