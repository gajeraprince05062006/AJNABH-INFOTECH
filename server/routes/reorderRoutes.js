const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const Service = require('../models/Service');
const Project = require('../models/Project');
const Product = require('../models/Product');
const TeamMember = require('../models/TeamMember');
const Blog = require('../models/Blog');
const Testimonial = require('../models/Testimonial');

// Map types to mongoose models
const modelMap = {
  services: Service,
  projects: Project,
  portfolio: Project,
  products: Product,
  team: TeamMember,
  blogs: Blog,
  testimonials: Testimonial
};

// PUT /api/admin/reorder (protected)
router.put('/', auth, async (req, res) => {
  const { type } = req.query;
  const items = req.body;

  if (!type || !modelMap[type]) {
    return res.status(400).json({ message: 'Invalid or missing type query parameter.' });
  }

  if (!Array.isArray(items)) {
    return res.status(400).json({ message: 'Request body must be an array of items.' });
  }

  // Validate each item has id and displayOrder
  for (const item of items) {
    if (!item.id || !String(item.id).match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Each item must have a valid id.' });
    }
    if (typeof item.displayOrder !== 'number') {
      return res.status(400).json({ message: 'Each item must have a numeric displayOrder.' });
    }
  }

  const Model = modelMap[type];

  try {
    const updatePromises = items.map(item => {
      return Model.findByIdAndUpdate(item.id, { displayOrder: item.displayOrder }, { new: true });
    });

    await Promise.all(updatePromises);
    res.status(200).json({ message: 'Order updated successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update reorder sequence.' });
  }
});

module.exports = router;
