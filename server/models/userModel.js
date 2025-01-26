import mongoose from "mongoose";

let userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    isAdmin: { type: Boolean, default: false },

    isAgent: { type: Boolean, required: true, default: false },

    isClient: { type: Boolean, required: true, default: false },

    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

let User = mongoose.model("User", userSchema);

export default User;
