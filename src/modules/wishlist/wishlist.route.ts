import express from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize";
import {
    addToWishlist,
    getFavListbyUserId,
    
} from "./wishlist.controller";

const router = express.Router();

// Add item to wishlist
router.post("/add", authenticate, authorize("customer"), addToWishlist);

// Get all list of wishlist
router.get("/get-list", authenticate, authorize("customer"), getFavListbyUserId)

export default router;
