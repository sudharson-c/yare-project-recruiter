const mongoose =  require("mongoose");

const UserSchema = mongoose.Schema({
  username: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  avatar: { type: String},
  phone: { type: String},
  projectIds : [Number]

});

module.exports = mongoose.model("User", UserSchema);