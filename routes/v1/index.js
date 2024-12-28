import express from "express";
import { userRouter } from "./userRouter.js";
import { adminRouter } from "./adminRouter.js";
import { restaurantRouter } from "./restaurantRouter.js";
import { sellerRouter } from "./sellerRouter.js";

const router = express.Router();

router.use("/user", userRouter);
router.use("/admin", adminRouter);
router.use("/seller", sellerRouter)
router.use("/restaurant", restaurantRouter)

export const v1Router = router;
