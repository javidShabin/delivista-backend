import express from "express"
import { loginAdmin, registerAdmin } from "../../controllers/adminController.js";

const router = express.Router();

router.post("/sigup-admin", registerAdmin)
router.post("/login-admin", loginAdmin)

export const adminRouter = router