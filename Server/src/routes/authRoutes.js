// src/routes/authRoutes.js
import express from "express";
import {
  login,
  register,
  loginWithOTP,
  verifyOTP,
  socialLogin,
  getAllUsers,
  changePassword,
  forgotPassword,
  resetPassword,
} from "../controllers/authControllers.js";

const router = express.Router();

// -------------------- Email/password registration and login --------------------
router.post("/register", register); //done
router.post("/login", login); //done

router.get("/users", getAllUsers); //done

// -------------------- OTP login routes --------------------
router.post("/login/otp", loginWithOTP); // send OTP to email  //done
router.post("/login/otp/verify", verifyOTP); // verify OTP and get JWT //done

// -------------------- Social login route --------------------
router.post("/social-login", socialLogin); // login/register via Google, Facebook, etc. //done

// New routes
router.post("/change-password", changePassword); // done
router.post("/forgot-password", forgotPassword); // done
router.post("/reset-password", resetPassword); // done

export default router;
