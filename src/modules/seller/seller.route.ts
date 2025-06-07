import express from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize";
import { upload } from "../../middlewares/multer";
import { signupSeller } from "./seller.controller";

const router = express.Router();

// Seller signup
router.post("/seller-signup", signupSeller)
export default router;