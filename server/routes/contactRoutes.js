const express = require('express');
const router = express.Router();
const validator = require('validator');
const rateLimit = require('express-rate-limit');
const Contact = require('../models/Contact');
const auth = require('../middleware/auth');

// Rate limiter for contact form: 10 submissions per hour per IP
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { message: 'Too many contact submissions. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});

// POST /api/contacts - Submit a new contact form (public, rate limited)
router.post('/', contactLimiter, async (req, res) => {
  // Input validation
  const { name, email, company, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required.' });
  }

  if (typeof name !== 'string' || name.trim().length < 1 || name.trim().length > 100) {
    return res.status(400).json({ message: 'Name must be between 1 and 100 characters.' });
  }

  if (typeof email !== 'string' || !validator.isEmail(email)) {
    return res.status(400).json({ message: 'A valid email address is required.' });
  }

  if (typeof message !== 'string' || message.trim().length < 5 || message.trim().length > 5000) {
    return res.status(400).json({ message: 'Message must be between 5 and 5000 characters.' });
  }

  try {
    const newContact = new Contact({
      name: validator.trim(validator.escape(name)).substring(0, 100),
      email: validator.normalizeEmail(validator.trim(email)),
      company: company ? validator.trim(validator.escape(String(company))).substring(0, 200) : undefined,
      message: validator.trim(validator.escape(message)).substring(0, 5000)
    });
    await newContact.save();
    res.status(201).json({ message: 'Contact submitted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit contact.' });
  }
});

// GET /api/contacts - Get all active contacts (protected)
router.get('/', auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ isActive: { $ne: false } }).sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /api/contacts/:id - Update contact (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }

    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found.' });
    if (req.body.isActive !== undefined) contact.isActive = req.body.isActive;
    await contact.save();
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// DELETE /api/contacts/:id - Hard-delete a contact (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }

    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found.' });
    await contact.deleteOne();
    res.status(200).json({ message: 'Contact deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
