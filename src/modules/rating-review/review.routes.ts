
import express from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize";
import { getAllReviewsBySellerId, ratingRestaurant } from "./review.controller";


const router = express.Router();

router.post("/restaurant-review",authenticate,authorize("customer"), ratingRestaurant)
router.post("/get-all-review",authenticate,authorize("customer"), getAllReviewsBySellerId)


export default router;
