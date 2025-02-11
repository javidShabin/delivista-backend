import express from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize";
import { addToCart, deleteCart, deleteFromCart, getCartByUserId, updateCart } from "./cart.controller";

const router = express.Router();

router.post("/add-cart", authenticate, authorize("customer"), addToCart);
router.get("/cart-items", authenticate, authorize("customer"), getCartByUserId);
router.put("/update-cart", authenticate, authorize("customer"), updateCart)
router.delete(
  "/remove-item",
  authenticate,
  authorize("customer"),
  deleteFromCart
);
router.delete("/remove-cart", authenticate, authorize("customer"), deleteCart)

export default router;
