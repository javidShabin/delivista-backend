import express from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize";
import { createAddress } from "./address.controller";

const router = express.Router()

router.post("/create-address", authenticate, authorize("customer"), createAddress)

export default router;
