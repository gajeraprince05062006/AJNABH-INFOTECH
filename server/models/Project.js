const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String },
  techStack: [{ type: String }],
  link: { type: String },
  isActive: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Performance optimization: indexes for query filters and sorting
projectSchema.index({ isActive: 1, displayOrder: 1, createdAt: -1 });

module.exports = mongoose.model('Project', projectSchema);
