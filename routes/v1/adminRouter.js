import express from "express"
import { adminLogout, adminProfile, loginAdmin, registerAdmin, updateAdminProfile } from "../../controllers/adminController.js";
import { adminAuth } from "../../middlewares/adminAuth.js";
import { upload } from "../../middlewares/multer.js";

const router = express.Router();

router.post("/sigup-admin", registerAdmin) // Route for admin registration
router.post("/login-admin", loginAdmin) // Login the admin check the email and passowrd for login
router.post("/admin-logout", adminLogout)// Logout the admin, clear the token from the cookie
router.get("/admin-profile", adminAuth, adminProfile) // Get admin profile , fetch the admin profile data from admin id from adim requst
router.put("/update-profile", adminAuth, upload.single("image"), updateAdminProfile) // Update admin profile including profile image also using cloudinery and bcrypt

export const adminRouter = router