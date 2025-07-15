import express from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize";
import { upload } from "../../middlewares/multer";
import {
  createMenu,
  deleteMenu,
  getMenusByAvailability,
  getMenusByCategory,
  getMenusByRestaurant,
  getMenusByTag,
  searchMenus,
  updateMenu,
} from "./menu.controller";

const router = express.Router();

// ****************** Endpoints for Menu Management ****************** //

// Route for create new menu by seller
router.post(
  "/create-menu",
  authenticate,
  authorize("seller"),
  upload.single("image"),
  createMenu
);

// Route for update existing menu by id by seller
router.put(
  "/update-menu/:id",
  authenticate,
  authorize("seller"),
  upload.single("image"),
  updateMenu
);

// Route for delete existing menu by id by seller
router.delete(
  "/remove-menu/:id",
  authenticate,
  authorize("seller"),
  deleteMenu
);

// Route for get all menus by restaurant by admin or customer
router.get(
  "/get-all-menus/:restaurantId",
  authenticate,
  authorize("admin", "customer"),
  getMenusByRestaurant
);

// Route for get all menus by category by admin or customer
router.get(
  "/get-menu-by-catagory/:category",
  authenticate,
  authorize("admin", "customer"),
  getMenusByCategory
);

// Route for get all menus by tag by admin or customer
router.get(
  "/menu-by-tag",
  authenticate,
  authorize("admin", "customer"),
  getMenusByTag
);

// Route for get all menus by availability by admin or customer (available or unavailable) by admin or customer
router.get(
  "/available-menu",
  authenticate,
  authorize("admin", "customer"),
  getMenusByAvailability
);

// Route for search menus by name by admin or customer
router.get(
  "/search-menu",
  authenticate,
  authorize("admin", "customer"),
  searchMenus
);

export default router;
