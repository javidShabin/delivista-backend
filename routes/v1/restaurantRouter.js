import express from "express";
import { sellerAuth } from "../../middlewares/sellerAuth.js";
import { upload } from "../../middlewares/multer.js";
import {
  createRestaurant,
  getAllRestaurant,
  getRestaurantById,
  updateRestaurant,
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
router.put("/update-restaurant/:id", updateRestaurant)

export const restaurantRouter = router;
