import express from "express";
import { userRouter } from "./userRouter.js";
import { adminRouter } from "./adminRouter.js";

const router = express.Router();

router.use("/user", userRouter);
router.use("/admin", adminRouter)

export const v1Router = router;
