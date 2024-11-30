const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  project_name: { type: String, required: true },
  project_desc: { type: String, required: true },
  project_link: { type: String, required: true },
  owner: { type: String, ref: 'Users', required: true },
  collaborators: [{ type: String, ref: 'Users', default: [] }],
  status: { type: String, enum: ['NEW', 'IN PROGRESS', 'COMPLETED'], default: 'NEW' },
  stipend: { type: Number, default: 0 },
  benefits: { type: String, default: '' },
  members_needed: { type: Number, required: true },
}, {
  timestamps: true
});

module.exports = mongoose.model('Projects', ProjectSchema);
