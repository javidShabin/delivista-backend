import express from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize";
import { upload } from "../../middlewares/multer";
import {
  generateFogotPassOtp,
  getAdminProfile,
  loginAdmin,
  logoutAdmin,
  signupAdmin,
  updateAdminPassword,
  updateAdminProfile,
  verifyAdminOTP,
  verifyForgotPasswordOtp,
} from "./admin.controller";
const router = express.Router();

// Admin signup
router.post("/admin-signup", signupAdmin);
// Verify admin OTP
router.post("/verify-admin-otp", verifyAdminOTP);
// Admin login
router.post("/admin-login", loginAdmin);
// Admin profile using authentication and authorization
router.get("/admin-profile", authenticate, authorize("admin"), getAdminProfile);
// Admin profile update and upload profile image
router.put(
  "/admin-profile-update",
  authenticate,
  authorize("admin"),
  upload.single("avatar"),
  updateAdminProfile
);
// Admin forgot password OTP generation
router.post("/admin-forgot-password-otp", generateFogotPassOtp);
// Admin forgot password OTP verification
router.post("/admin-forgot-password-verify-otp", verifyForgotPasswordOtp);
// Update admin password
router.patch("/admin-update-password", updateAdminPassword);
// Admin logout
router.delete("/admin-logout", logoutAdmin);

export default router;
