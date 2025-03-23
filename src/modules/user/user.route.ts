import express from "express";
import {
  checkUser,
  generateFogotPassOtp,
  getAllUsers,
  getUserProfileById,
  loginUser,
  logoutUser,
  signupUser,
  updateUserPassword,
  updateUserProfile,
  verifyForgotPasswordOtp,
  verifyOtpAndCreateUser,
} from "./user.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize";
import { upload } from "../../middlewares/multer";
const router = express.Router();
// User signup
router.post("/user-signup", signupUser);
// User OTP verification
router.post("/verify-otp", verifyOtpAndCreateUser);
// User login
router.post("/user-login", loginUser);
// Get all useres
router.get("/users-list", authenticate, authorize( "admin", "seller"), getAllUsers);
// Get user profile
router.get(
  "/user-profile",
  authenticate,
  authorize("customer", "admin"),
  getUserProfileById
);
// Update user profile
router.put(
  "/user-profile-update",
  authenticate,
  authorize("customer"),
  upload.single("avatar"),
  updateUserProfile
);
// Forgot password OTP generating
router.post("/forgot-password", generateFogotPassOtp);
// Forgot password OTP verifying
router.post("/verify-pass-otp", verifyForgotPasswordOtp);
// Update the user password
router.patch("/update-password", updateUserPassword);
// Logout the user , (clear the toker from cookie)
router.delete("/user-logout", logoutUser);
// Check user router
router.get("/user-check", authenticate, authorize("customer"), checkUser);
export default router;
