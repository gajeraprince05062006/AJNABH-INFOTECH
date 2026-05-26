const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String },
  isActive: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Performance optimization: indexes for query filters and sorting
blogSchema.index({ isActive: 1, displayOrder: 1, createdAt: -1 });

module.exports = mongoose.model('Blog', blogSchema);
