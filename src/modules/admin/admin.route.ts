import express from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize";
import { upload } from "../../middlewares/multer";
import { signupAdmin } from "./admin.controller";
const router = express.Router();

// Admin signup
router.post("/admin-signup", signupAdmin)

export default router;