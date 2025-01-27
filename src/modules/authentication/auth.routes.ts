import express from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize";
import { loginUser, singupUser, verifyOtpandCreateUser } from "./auth.controller";

const router = express.Router();

router.post("/user-signup", singupUser)

router.post("/verify-user-otp", verifyOtpandCreateUser)

router.post("/user-login", loginUser)

export default router;
