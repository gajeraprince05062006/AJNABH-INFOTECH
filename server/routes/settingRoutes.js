const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');
const auth = require('../middleware/auth');

// Get setting by key (public)
router.get('/:key', async (req, res) => {
  try {
    // Whitelist allowed keys to prevent enumeration
    const allowedKeys = ['general', 'seo', 'stats'];
    const key = String(req.params.key).toLowerCase();
    if (!allowedKeys.includes(key)) {
      return res.status(404).json({ message: 'Settings key not found.' });
    }

    const setting = await Setting.findOne({ key });
    if (!setting) {
      // Return default values depending on key
      if (key === 'general') {
        return res.json({
          key: 'general',
          value: {
            siteName: 'AJNABH INFOTECH',
            contactEmail: 'contact@ajnabh.com',
            contactPhone: '+91 98765 43210',
            address: 'Corporate Headquarters, AJNABH INFOTECH, India',
            footerDescription: 'Transforming ideas into intelligent digital solutions. We build modern software, AI systems, and enterprise platforms.',
            footerTagline: 'Innovation • Technology • Growth'
          }
        });
      } else if (key === 'seo') {
        return res.json({
          key: 'seo',
          value: {
            title: 'AJNABH INFOTECH - AI Automation & Custom Enterprise Software',
            description: 'Provide high-quality custom software solutions, AI voice/agent systems, inventory systems, school ERPs, and complete web/mobile engineering.',
            keywords: 'AI, ERP, Software development, Custom solutions, Web apps, Flutter, Node'
          }
        });
      } else if (key === 'stats') {
        return res.json({
          key: 'stats',
          value: [
            { id: 'projects', iconName: 'Rocket', value: '50+', label: 'Projects Completed' },
            { id: 'clients', iconName: 'Users', value: '20+', label: 'Happy Clients' },
            { id: 'products', iconName: 'Cpu', value: '5+', label: 'AI Products' },
            { id: 'support', iconName: 'Headphones', value: '24/7', label: 'Support Available' }
          ]
        });
      }
      return res.status(404).json({ message: 'Settings key not found.' });
    }
    res.json(setting);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Update or create setting by key (protected)
router.post('/:key', auth, async (req, res) => {
  try {
    const allowedKeys = ['general', 'seo', 'stats'];
    const key = String(req.params.key).toLowerCase();
    if (!allowedKeys.includes(key)) {
      return res.status(400).json({ message: 'Invalid settings key.' });
    }

    let setting = await Setting.findOne({ key });
    if (setting) {
      setting.value = req.body.value;
      setting.updatedAt = Date.now();
      await setting.save();
    } else {
      setting = new Setting({
        key,
        value: req.body.value
      });
      await setting.save();
    }
    res.json(setting);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update settings.' });
  }
});

module.exports = router;
