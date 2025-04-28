import express from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize";
import { upload } from "../../middlewares/multer";
import {
  generateFogotPassOtp,
  getAllSellers,
  getSellerProfile,
  loginSeller,
  logoutSeller,
  signupSeller,
  updateSellerPassword,
  updateSellerProfile,
  verifyForgotPasswordOtp,
  verifySellerOTP,
} from "./seller.controller";

const router = express.Router();

// Seller signup
router.post("/seller-signup", signupSeller);
// Seller OTP verification
router.post("/seller-otp-verification", verifySellerOTP);
// Seller login router
router.post("/seller-login", loginSeller);
// Seller all listings
router.get("/seller-list", getAllSellers);
// Seller profile by ID
router.get(
  "/seller-profile",
  authenticate,
  authorize("seller", "admin"),
  getSellerProfile
);
// Seller profile update
router.put(
  "/seller-profile-update",
  authenticate,
  authorize("seller"),
  upload.single("avatar"),
  updateSellerProfile
);
// Forgot password OTP generating
router.post("/seller-forgot-password", generateFogotPassOtp);
// Verify password OTP
router.post("/seller-forgot-password-verify-otp", verifyForgotPasswordOtp);
// Update seller password
router.patch("/seller-password-update", updateSellerPassword);
// Forgot the seller
router.delete("/seller-logout", logoutSeller)

export default router;
