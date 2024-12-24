import express from "express"
import { adminProfile, loginAdmin, registerAdmin } from "../../controllers/adminController.js";
import { adminAuth } from "../../middlewares/adminAuth.js";

const router = express.Router();

router.post("/sigup-admin", registerAdmin)
router.post("/login-admin", loginAdmin)
router.get("/admin-profile", adminAuth, adminProfile)

export const adminRouter = router