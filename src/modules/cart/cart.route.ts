import express from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize";
import { addToCart, getCartByUserId } from "./cart.controller";

const router = express.Router();

router.post("/add-cart", authenticate, authorize("customer"), addToCart);
router.get("/cart-items", authenticate, authorize("customer"), getCartByUserId);

export default router;