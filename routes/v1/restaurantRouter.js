import express from "express";
import { sellerAuth } from "../../middlewares/sellerAuth.js";
import { upload } from "../../middlewares/multer.js";
import {
  createRestaurant,
  getAllRestaurant,
  getRestaurantById,
} from "../../controllers/restaurantController.js";
const router = express.Router();

router.post(
  "/creat-restaurant",
  upload.single("image"),
  sellerAuth,
  createRestaurant
);
router.get("/getAll-restaurants", getAllRestaurant);
router.get("/getRestaurant-byId/:id", getRestaurantById);

export const restaurantRouter = router;
