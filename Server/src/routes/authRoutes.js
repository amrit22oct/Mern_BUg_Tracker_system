// src/routes/authRoutes.js
import express from "express";
import { 
  login, 
  register, 
  loginWithOTP, 
  verifyOTP, 
  socialLogin ,
  getAllUsers
} from "../controllers/authControllers.js";

const router = express.Router();

// -------------------- Email/password registration and login --------------------
router.post("/register", register);
router.post("/login", login);

router.get("/users", getAllUsers);

// -------------------- OTP login routes --------------------
router.post("/login/otp", loginWithOTP);       // send OTP to email
router.post("/login/otp/verify", verifyOTP);  // verify OTP and get JWT

// -------------------- Social login route --------------------
router.post("/social-login", socialLogin);    // login/register via Google, Facebook, etc.

export default router;
