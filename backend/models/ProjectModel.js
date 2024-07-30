const mongoose =  require("mongoose");

const ProjectSchema = new mongoose.Schema({
  project_name: { type: String, required: true },
  project_desc: { type: String, required: true },
  project_link: { type: String, required: true },
  owner: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  collaborators: [{ type: mongoose.Schema.ObjectId, ref: 'User', default: [] }],
  status: { type: String, enum: ['NEW', 'IN PROGRESS', 'COMPLETED'], default: 'NEW' },
  stipend: { type: Number, default: 0 },
  benefits: { type: String, default: '' },
  members_needed: { type: Number, required: true },
  clerkid : {type:String,required:true}
}, {
  timestamps: true
});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;
