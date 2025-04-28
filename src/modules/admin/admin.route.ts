import express from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize";
import { upload } from "../../middlewares/multer";
import { signupAdmin, verifyAdminOTP } from "./admin.controller";
const router = express.Router();

// Admin signup
router.post("/admin-signup", signupAdmin)
// Verify admin OTP
router.post("/verify-admin-otp", verifyAdminOTP);

export default router;