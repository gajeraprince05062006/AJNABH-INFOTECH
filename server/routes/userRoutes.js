const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const validator = require('validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Rate limiter for login: 5 attempts per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Too many login attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Get all admin users (protected)
router.get('/', auth, async (req, res) => {
  try {
    const filter = req.query.admin === 'true' ? {} : { isActive: { $ne: false } };
    const users = await User.find(filter).sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Register new admin user (protected — only admins can create new admins)
router.post('/register', auth, async (req, res) => {
  const { username, password } = req.body;

  // Input validation
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }
  if (typeof username !== 'string' || username.trim().length < 3 || username.trim().length > 50) {
    return res.status(400).json({ message: 'Username must be between 3 and 50 characters.' });
  }
  if (typeof password !== 'string' || password.length < 6 || password.length > 128) {
    return res.status(400).json({ message: 'Password must be between 6 and 128 characters.' });
  }

  try {
    const sanitizedUsername = validator.trim(validator.escape(username));
    const existing = await User.findOne({ username: sanitizedUsername });
    if (existing) return res.status(400).json({ message: 'Username already exists.' });

    const user = new User({ username: sanitizedUsername, password });
    const newUser = await user.save();
    res.status(201).json({ _id: newUser._id, username: newUser.username });
  } catch (err) {
    res.status(400).json({ message: 'Failed to create user.' });
  }
});

// Login (rate limited)
router.post('/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    // Explicitly select password for comparison
    const user = await User.findOne({ username }).select('+password');
    if (!user || user.isActive === false) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    // Generate JWT token (expires in 8 hours)
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      success: true,
      token,
      user: { _id: user._id, username: user.username }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Update admin user (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid user ID format.' });
    }

    const user = await User.findById(req.params.id).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found.' });

    if (req.body.isActive !== undefined) {
      const count = await User.countDocuments({ isActive: { $ne: false } });
      if (req.body.isActive === false && count <= 1 && user.isActive !== false) {
        return res.status(400).json({ message: 'Cannot deactivate the only active administrator.' });
      }
      user.isActive = req.body.isActive;
    }

    if (req.body.username != null) {
      const sanitizedUsername = validator.trim(validator.escape(String(req.body.username)));
      if (sanitizedUsername.length < 3 || sanitizedUsername.length > 50) {
        return res.status(400).json({ message: 'Username must be between 3 and 50 characters.' });
      }
      user.username = sanitizedUsername;
    }

    if (req.body.password != null) {
      if (typeof req.body.password !== 'string' || req.body.password.length < 6 || req.body.password.length > 128) {
        return res.status(400).json({ message: 'Password must be between 6 and 128 characters.' });
      }
      user.password = req.body.password; // pre-save hook will hash it
    }

    const updatedUser = await user.save();
    res.json({ _id: updatedUser._id, username: updatedUser.username, isActive: updatedUser.isActive });
  } catch (err) {
    res.status(400).json({ message: 'Failed to update user.' });
  }
});

// Delete admin user (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid user ID format.' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const count = await User.countDocuments();
    if (count <= 1) {
      return res.status(400).json({ message: 'Cannot delete the only administrator.' });
    }

    await user.deleteOne();
    res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
