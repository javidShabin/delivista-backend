import express from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize";
import {
    addToWishlist,
    getAllWishlistByUserId,
    removeWishlistItem,
    checkWishlistItem
} from "./wishlist.controller";

const router = express.Router();

// Add item to wishlist
router.post("/add", authenticate, authorize("customer"), addToWishlist);

// Get all wishlist items by user ID
router.get("/items", authenticate, authorize("customer"), getAllWishlistByUserId);

// Remove item from wishlist
router.delete("/remove", authenticate, authorize("customer"), removeWishlistItem);

// Check if item exists in wishlist (optional)
router.get("/check", authenticate, authorize("customer"), checkWishlistItem);

export default router;
