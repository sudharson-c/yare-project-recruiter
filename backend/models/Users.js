const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  _id: String,
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  avatar: { type: String },
  projectIds: [{ type: mongoose.Schema.ObjectId, ref: 'Projects', default: [] }]
}, { timestamps: true });

module.exports = mongoose.model("Users", UserSchema);