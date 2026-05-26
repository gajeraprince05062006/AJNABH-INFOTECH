const express = require('express');
const router = express.Router();
const validator = require('validator');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Get all products (public: active only; admin: all — requires auth)
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
    const products = await Product.find(filter).sort({ displayOrder: 1, createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Create a product (protected)
router.post('/', auth, async (req, res) => {
  if (!req.body.name || !req.body.overview) {
    return res.status(400).json({ message: 'Name and overview are required.' });
  }

  const product = new Product({
    name: validator.trim(String(req.body.name)).substring(0, 200),
    overview: validator.trim(String(req.body.overview)).substring(0, 5000),
    features: Array.isArray(req.body.features) ? req.body.features.map(f => validator.trim(String(f)).substring(0, 200)) : [],
    benefits: Array.isArray(req.body.benefits) ? req.body.benefits.map(b => validator.trim(String(b)).substring(0, 200)) : [],
    price: req.body.price ? validator.trim(String(req.body.price)).substring(0, 100) : 'Custom Pricing',
    demoUrl: req.body.demoUrl ? validator.trim(String(req.body.demoUrl)).substring(0, 2000) : undefined,
    imageUrl: req.body.imageUrl ? validator.trim(String(req.body.imageUrl)).substring(0, 2000) : undefined,
    isActive: req.body.isActive !== undefined ? req.body.isActive : true
  });
  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create product.' });
  }
});

// Update a product (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    if (req.body.name != null) product.name = validator.trim(String(req.body.name)).substring(0, 200);
    if (req.body.overview != null) product.overview = validator.trim(String(req.body.overview)).substring(0, 5000);
    if (req.body.features != null) product.features = Array.isArray(req.body.features) ? req.body.features.map(f => validator.trim(String(f)).substring(0, 200)) : [];
    if (req.body.benefits != null) product.benefits = Array.isArray(req.body.benefits) ? req.body.benefits.map(b => validator.trim(String(b)).substring(0, 200)) : [];
    if (req.body.price != null) product.price = validator.trim(String(req.body.price)).substring(0, 100);
    if (req.body.demoUrl != null) product.demoUrl = validator.trim(String(req.body.demoUrl)).substring(0, 2000);
    if (req.body.imageUrl != null) product.imageUrl = validator.trim(String(req.body.imageUrl)).substring(0, 2000);
    if (req.body.isActive !== undefined) product.isActive = req.body.isActive;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update product.' });
  }
});

// Delete a product (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    await product.deleteOne();
    res.json({ message: 'Product deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
