import express from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize";
import {
    addToWishlist,
    
} from "./wishlist.controller";

const router = express.Router();

// Add item to wishlist
router.post("/add", authenticate, authorize("customer"), addToWishlist);


export default router;
