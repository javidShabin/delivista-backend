import express from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize";
import { upload } from "../../middlewares/multer";
import {
  getAdminProfile,
  loginAdmin,
  signupAdmin,
  updateAdminProfile,
  verifyAdminOTP,
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

export default router;
