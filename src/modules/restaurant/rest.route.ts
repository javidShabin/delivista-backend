import express from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize";
import { upload } from "../../middlewares/multer";
import {
  adminVerifyingRestaurant,
  createRestaurant,
  getAllRestaurants,
  getRestaurant,
  getVerifiedRestaurants,
} from "./rest.controller";

const router = express.Router();

// Create restaurant for seller
router.post(
  "/create-restaurant",
  authenticate,
  authorize("seller"),
  upload.single("image"),
  createRestaurant
);
// Get all restaurant list
router.get("/get-all-restaurants", getAllRestaurants);
// Get admin verified restaurant list
router.get(
  "/verified-restaurants",
  authenticate,
  authorize("customer", "admin"),
  getVerifiedRestaurants
);
// Admin restaurant verification
router.patch(
  "/verification-restaurant/:restaurantId",
  authenticate,
  authorize("admin"),
  adminVerifyingRestaurant
);
// Get restaurant by id
router.get(
  "/restaurant-byId/:restaurantId",
  authenticate,
  authorize("admin", "customer", "seller"),
  getRestaurant
);

export default router;
