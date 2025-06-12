import express from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize";
import { upload } from "../../middlewares/multer";
import { createRestaurant, getAllRestaurants } from "./rest.controller";

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
router.get("/get-all-restaurants", getAllRestaurants)

export default router;
