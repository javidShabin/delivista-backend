import express from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize";
import { upload } from "../../middlewares/multer";
import {
  createRestaurant,
  getAllRestaurants,
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

export default router;
