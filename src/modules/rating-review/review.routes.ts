
import express from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize";
import { ratingRestaurant } from "./review.controller";


const router = express.Router();

router.post("/restaurant-review",authenticate,authorize("customer"), ratingRestaurant)


export default router;
