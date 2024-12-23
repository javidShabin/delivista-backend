import express from "express";
import {
  ChangePassword,
  checkUser,
  deleteUser,
  forgotPassword,
  getAllUsers,
  updateUserProfile,
  userLogin,
  userLogout,
  userProfile,
  userRegistration,
  verifyOtpAndCreateUser,
  verifyOtpAndResetPassword,
} from "../../controllers/userController.js"; // Import the userRegistration function
import { userAuth } from "../../middlewares/usetAuth.js";
import { upload } from "../../middlewares/multer.js";

const router = express.Router();

router.post("/signup", userRegistration); // Use userRegistration as the handler for POST /signup
router.post("/verify-otp", verifyOtpAndCreateUser); // Otp verification haldler for pot
router.post("/login-user", userLogin); // user login handler for post request
router.get("/user-list", getAllUsers) // Get user list handler get all useres from the database
router.post("/user-logout", userLogout) // User logout handler clear the token from the cookie
router.get("/user-profile", userAuth, userProfile) // Get user profile using user id
router.put("/update-profile", userAuth, upload.single("image"), updateUserProfile) // Update user profile include the profile image
router.put("/edit-password", ChangePassword) // Change the password check the email and change the passord
router.post("/forgot-password", forgotPassword) // Forgot password function and send verification otp to the email
router.post("/verify-reset-otp", verifyOtpAndResetPassword) // Check and verify the otp and change the password
router.delete("/delete-user", deleteUser) // Delete the user finding id
router.get("/check-user", userAuth, checkUser)

export const userRouter = router;
