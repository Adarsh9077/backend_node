import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username must required"],
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Email must required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password must required"],
    },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);

// ! 41:35
