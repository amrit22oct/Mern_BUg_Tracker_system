// src/models/userModel.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      trim: true,
      required: true, // auto-generated if not provided
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: false, // not required for social login
    },
    role: {
      type: String,
      enum: ["Admin", "ProjectManager", "Developer", "QA"],
      default: "Developer",
    },
    avatar: {
      type: String,
      default: "",
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    // -------------------- OTP Fields --------------------
    otp: {
      type: String, // store OTP as string
    },
    otpExpires: {
      type: Number, // timestamp in milliseconds
    },
    // -------------------- Social Login --------------------
    googleId: {
      type: String,
      default: null,
    },
    facebookId: {
      type: String,
      default: null,
    },
    // you can add more providers here like githubId, etc.
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

const User = mongoose.model("User", userSchema);

export default User;
