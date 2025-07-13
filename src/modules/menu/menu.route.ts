import express from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize";
import { upload } from "../../middlewares/multer";
import { createMenu, getMenusByRestaurant } from "./menu.controller";

const router = express.Router();

router.post(
  "/create-menu",
  authenticate,
  authorize("seller"),
  upload.single("image"),
  createMenu
);

router.get(
  "/get-all-menus/:restaurantId",
  authenticate,
  authorize("admin", "customer"),
  getMenusByRestaurant
);

export default router;
