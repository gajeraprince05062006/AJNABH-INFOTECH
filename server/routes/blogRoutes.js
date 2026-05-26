const express = require('express');
const router = express.Router();
const validator = require('validator');
const Blog = require('../models/Blog');
const auth = require('../middleware/auth');
const { uploadImage } = require('../utils/cloudinaryService');

// Get all blogs (public: active only; admin: all — requires auth)
router.get('/', async (req, res) => {
  try {
    let filter = { isActive: { $ne: false } };
    if (req.query.admin === 'true') {
      // Verify auth for admin access
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
    const blogs = await Blog.find(filter).sort({ displayOrder: 1, createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Create a blog (protected)
router.post('/', auth, async (req, res) => {
  // Input validation
  if (!req.body.title || !req.body.content || !req.body.category || !req.body.author) {
    return res.status(400).json({ message: 'Title, content, category, and author are required.' });
  }

  try {
    let imageUrl = undefined;
    if (req.body.imageUrl) {
      imageUrl = await uploadImage(req.body.imageUrl);
    }

    const blog = new Blog({
      title: validator.trim(String(req.body.title)).substring(0, 200),
      content: validator.trim(String(req.body.content)).substring(0, 50000),
      category: validator.trim(String(req.body.category)).substring(0, 100),
      author: validator.trim(String(req.body.author)).substring(0, 100),
      imageUrl: imageUrl ? validator.trim(String(imageUrl)).substring(0, 2000) : undefined,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true
    });

    const newBlog = await blog.save();
    res.status(201).json(newBlog);
  } catch (err) {
    res.status(400).json({ message: err.message || 'Failed to create blog.' });
  }
});

// Update a blog (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found.' });

    let imageUrl = undefined;
    if (req.body.imageUrl !== undefined) {
      imageUrl = await uploadImage(req.body.imageUrl);
    }

    if (req.body.title != null) blog.title = validator.trim(String(req.body.title)).substring(0, 200);
    if (req.body.content != null) blog.content = validator.trim(String(req.body.content)).substring(0, 50000);
    if (req.body.category != null) blog.category = validator.trim(String(req.body.category)).substring(0, 100);
    if (req.body.author != null) blog.author = validator.trim(String(req.body.author)).substring(0, 100);
    if (imageUrl !== undefined) blog.imageUrl = imageUrl ? validator.trim(String(imageUrl)).substring(0, 2000) : undefined;
    if (req.body.isActive !== undefined) blog.isActive = req.body.isActive;

    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } catch (err) {
    res.status(400).json({ message: err.message || 'Failed to update blog.' });
  }
});

// Delete a blog (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found.' });
    await blog.deleteOne();
    res.json({ message: 'Blog deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
