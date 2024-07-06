import mongoose from "mongoose";

const User = mongoose.model("User", {
  username: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  avatar: { type: String},
  phone: { type: String},
  projectIds : [Number]

});

export default User;