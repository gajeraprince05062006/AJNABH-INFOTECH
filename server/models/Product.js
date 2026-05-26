const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  overview: { type: String, required: true },
  features: [{ type: String }],
  benefits: [{ type: String }],
  price: { type: String, default: 'Custom Pricing' },
  demoUrl: { type: String },
  imageUrl: { type: String },
  isActive: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
