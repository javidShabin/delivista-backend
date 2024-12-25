import express from "express"
import { adminLogout, adminProfile, changePassword, loginAdmin, registerAdmin, updateAdminProfile } from "../../controllers/adminController.js";
import { adminAuth } from "../../middlewares/adminAuth.js";
import { upload } from "../../middlewares/multer.js";

const router = express.Router();

router.post("/signup-admin", registerAdmin); // Route for admin registration
router.post("/login-admin", loginAdmin); // Route for admin login, checks email and password for authentication
router.post("/admin-logout", adminLogout); // Route to log out the admin, clears the token from cookies
router.get("/admin-profile", adminAuth, adminProfile); // Route to fetch admin profile data using admin ID from the request
router.put("/update-profile", adminAuth, upload.single("image"), updateAdminProfile); // Route to update admin profile, including profile image using Cloudinary and bcrypt
router.put("/change-password", adminAuth, changePassword); // Change the passowrd checking email already in database


export const adminRouter = router