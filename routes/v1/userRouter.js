import express from "express";
import {
  userLogin,
  userRegistration,
  verifyOtpAndCreateUser,
} from "../../controllers/userController.js"; // Import the userRegistration function

const router = express.Router();

router.post("/signup", userRegistration); // Use userRegistration as the handler for POST /signup
router.post("/verify-otp", verifyOtpAndCreateUser); // Otp verification haldler for pot
router.post("/login-user", userLogin); // user login handler for post request

export const userRouter = router;
