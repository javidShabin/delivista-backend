import express from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize";
import { upload } from "../../middlewares/multer";

const router = express.Router();

export default router;
