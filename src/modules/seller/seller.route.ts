import express from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize";
import { upload } from "../../middlewares/multer";
import { signupSeller, verifySellerOTP } from "./seller.controller";

const router = express.Router();

// Seller signup
router.post("/seller-signup", signupSeller);
// Seller OTP verification
router.post("/seller-otp-verification", verifySellerOTP);
export default router;
