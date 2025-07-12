import express from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize";
import { upload } from "../../middlewares/multer";
import { createMenu } from "./menu.controller";

const router = express.Router();

router.post(
  "/create-menu",
  authenticate,
  authorize("seller"),
  upload.single("image"),
  createMenu
);

export default router;
