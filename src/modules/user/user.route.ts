import express from "express";
import {  getAllUsers, getUserProfileById, loginUser, signupUser, updateUserProfile, verifyOtpAndCreateUser } from "./user.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize";
import { upload } from "../../middlewares/multer";
const router = express.Router();
// User signup
router.post("/user-signup", signupUser)
// User OTP verification
router.post("/verify-token", verifyOtpAndCreateUser)
// User login
router.post("/user-login", loginUser)
// Get all useres
router.get("/users-list", getAllUsers)
// Get user profile
router.get("/user-profile/:userId", getUserProfileById)
// Update user profile
router.put("/user-profile-update",authenticate, authorize("customer"), upload.single("avatar"), updateUserProfile)


export default router;