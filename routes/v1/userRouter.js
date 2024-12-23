import express from "express";
import {
  getAllUsers,
  userLogin,
  userLogout,
  userRegistration,
  verifyOtpAndCreateUser,
} from "../../controllers/userController.js"; // Import the userRegistration function

const router = express.Router();

router.post("/signup", userRegistration); // Use userRegistration as the handler for POST /signup
router.post("/verify-otp", verifyOtpAndCreateUser); // Otp verification haldler for pot
router.post("/login-user", userLogin); // user login handler for post request
router.get("/get-user-list", getAllUsers) // Get user list handler get all useres from the database
router.post("/user-logout", userLogout)

export const userRouter = router;
