// src/controllers/authControllers.js
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { sendOTPEmail } from "../utils/sendOTPEmail.js";

// -------------------- Helpers --------------------

// Generate username automatically
const generateUsername = (email) => {
  const namePart = email.split("@")[0];
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${namePart}${randomNum}`;
};


 

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "3d" });
};

// -------------------- Register --------------------
export const register = async (req, res) => {
  try {
    let { name, username, email, password, role, avatar } = req.body;

    if (!username || username.trim() === "") username = generateUsername(email);
    if (!name || name.trim() === "") name = username;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      role,
      avatar,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      token,
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// -------------------- Login (email or username) --------------------
export const login = async (req, res) => {
  try {
    const { loginId, password } = req.body;

    const user = await User.findOne({
      $or: [{ username: loginId }, { email: loginId }],
    });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// -------------------- Send OTP --------------------
export const loginWithOTP = async (req, res) => {
   try {
     const { email } = req.body;
     const user = await User.findOne({ email });
     if (!user) return res.status(400).json({ message: "User not found" });
 
     const otp = crypto.randomInt(100000, 999999).toString();
     const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
 
     // Send OTP email
     await sendOTPEmail(email, otp);
 
     user.otp = otp;
     user.otpExpires = otpExpires;
     await user.save();
 
     res.status(200).json({ message: "OTP sent to your email" });
   } catch (error) {
     console.error("OTP Login Error:", error);
     res.status(500).json({ message: error.message });
   }
 };
 
 // -------------------- Verify OTP --------------------
 export const verifyOTP = async (req, res) => {
   try {
     const { email, otp } = req.body;
 
     if (!email || !otp) {
       return res.status(400).json({ message: "Email and OTP are required" });
     }
 
     const user = await User.findOne({ email });
     if (!user) return res.status(400).json({ message: "User not found" });
 
     // Convert both to strings to ensure comparison works
     if (!user.otp || user.otp.toString() !== otp.toString() || user.otpExpires < Date.now()) {
       return res.status(400).json({ message: "Invalid or expired OTP" });
     }
 
     // Clear OTP fields
     user.otp = null;
     user.otpExpires = null;
     await user.save();
 
     // Generate JWT
     const token = generateToken(user._id);
 
     res.status(200).json({
       message: "Login successful",
       user: {
         id: user._id,
         name: user.name,
         username: user.username,
         email: user.email,
         role: user.role,
         avatar: user.avatar,
       },
       token,
     });
   } catch (error) {
     console.error("Verify OTP Error:", error);
     res.status(500).json({ message: "Server Error" });
   }
 };
 

// -------------------- Social Login / Register --------------------
export const socialLogin = async (req, res) => {
  try {
    const { email, name, avatar, providerId, provider } = req.body;
    // provider = "google" or "facebook" etc.

    if (!email || !providerId || !provider)
      return res.status(400).json({ message: "Missing social login data" });

    let user = await User.findOne({ email });

    if (!user) {
      // create new user
      const username = generateUsername(email);
      const newUserData = {
        name: name || username,
        username,
        email,
        avatar,
      };

      // Save provider ID dynamically
      newUserData[`${provider}Id`] = providerId;

      user = await User.create(newUserData);
    } else {
      // update provider ID if missing
      if (!user[`${provider}Id`]) {
        user[`${provider}Id`] = providerId;
        await user.save();
      }
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      token,
    });
  } catch (error) {
    console.error("Social Login Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
