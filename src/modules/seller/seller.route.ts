import express from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize";
import { upload } from "../../middlewares/multer";
import { getAllSellers, getSellerProfile, loginSeller, signupSeller, verifySellerOTP } from "./seller.controller";

const router = express.Router();

// Seller signup
router.post("/seller-signup", signupSeller);
// Seller OTP verification
router.post("/seller-otp-verification", verifySellerOTP);
// Seller login router
router.post("/seller-login", loginSeller);
// Seller all listings
router.get("/seller-list", getAllSellers)
// Seller profile by ID
router.get("/seller-profile", authenticate, authorize("seller", "admin"), getSellerProfile);
export default router;
