import express from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize";
import { upload } from "../../middlewares/multer";
import {
  getAdminProfile,
  loginAdmin,
  signupAdmin,
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

export default router;
