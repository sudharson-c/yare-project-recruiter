const mongoose =  require("mongoose");

const UserSchema = mongoose.Schema({
  firstName: { type: String, required: true},
  lastName: { type: String, required: true },
  email: { type: String, required: true ,unique:true},
  role: { type: String, required: true },
  avatar: { type: String},
  projectIds : [{ type: mongoose.Schema.ObjectId, ref: 'Project', default: [] }]
});

module.exports = mongoose.model("User", UserSchema);