import express from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize";
import { upload } from "../../middlewares/multer";
import { createMenu, getMenusByCategory, getMenusByRestaurant, searchMenus, updateMenu } from "./menu.controller";

const router = express.Router();

router.post(
  "/create-menu",
  authenticate,
  authorize("seller"),
  upload.single("image"),
  createMenu
);

router.put(
  "/update-menu/:id",
  authenticate,
  authorize("seller"),
  upload.single("image"),
  updateMenu
)

router.get(
  "/get-all-menus/:restaurantId",
  authenticate,
  authorize("admin", "customer"),
  getMenusByRestaurant
);

router.get(
  "/get-menu-by-catagory/:category",
  authenticate,
  authorize("admin", "customer"),
  getMenusByCategory
);

router.get(
  "/search-menu",
  authenticate,
  authorize("admin", "customer"),
  searchMenus
);

export default router;
