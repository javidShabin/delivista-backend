import express from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize";
import {
  checkUser,
  loginUser,
  logoutUser,
  sendForgotPasswordOtp,
  singupUser,
  verifyOtpandCreateUser,
  verifyOtpAndUpdatePassword,
} from "./auth.controller";

const router = express.Router();

router.post("/user-signup", singupUser);

router.post("/verify-user-otp", verifyOtpandCreateUser);

router.post("/user-login", loginUser);

router.get(
  "/verify-auth",
  authenticate,
  authorize("admin", "customer", "seller"),
  checkUser
);

router.delete("/user-logout", logoutUser);

router.post("/forgot-password", sendForgotPasswordOtp);

router.patch("/update-password", verifyOtpAndUpdatePassword);

export default router;
