const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  skills: [{ type: String }],
  experience: { type: String },
  socialLinks: {
    linkedin: { type: String },
    twitter: { type: String },
    github: { type: String }
  },
  imageUrl: { type: String },
  isActive: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TeamMember', teamMemberSchema);
