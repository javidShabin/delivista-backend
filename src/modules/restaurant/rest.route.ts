import express from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize";
import { upload } from "../../middlewares/multer";
import {
  adminVerifyingRestaurant,
  createRestaurant,
  deleteRestaurant,
  getAllRestaurants,
  getRestaurant,
  getRestaurantBySeller,
  getVerifiedRestaurants,
  ratingReview,
  toggleRestaurantStatus,
  updateRestaurant,
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
router.get("/verified-restaurants",getVerifiedRestaurants);
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
// Get restaurant by seller
router.get(
  "/get-restaurant-sellerId",
  authenticate,
  authorize("seller"),
  getRestaurantBySeller
);
// Toggle restaurant status (Open and Close)
router.patch(
  "/restaurant-toggle",
  authenticate,
  authorize("seller"),
  toggleRestaurantStatus
);
// Update restaurant by id
router.put(
  "/update-restaurant/:restaurantId",
  authenticate,
  authorize("seller"),
  upload.single("image"),
  updateRestaurant
);
// Remove restauratn
router.delete("/remove-restaurant/:restaurantId", deleteRestaurant);

// Rate and review route for the restaurant
router.put("/review", authenticate, authorize("customer"), ratingReview)

export default router;
