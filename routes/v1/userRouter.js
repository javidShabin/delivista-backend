import express from "express";
import {
  getAllUsers,
  userLogin,
  userLogout,
  userProfile,
  userRegistration,
  verifyOtpAndCreateUser,
} from "../../controllers/userController.js"; // Import the userRegistration function
import { userAuth } from "../../middlewares/usetAuth.js";

const router = express.Router();

router.post("/signup", userRegistration); // Use userRegistration as the handler for POST /signup
router.post("/verify-otp", verifyOtpAndCreateUser); // Otp verification haldler for pot
router.post("/login-user", userLogin); // user login handler for post request
router.get("/user-list", getAllUsers) // Get user list handler get all useres from the database
router.post("/user-logout", userLogout) // User logout handler clear the token from the cookie
router.get("/user-profile", userAuth, userProfile) // Get user profile using user id

export const userRouter = router;
