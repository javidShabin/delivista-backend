import express from "express";
import { makePayment, verifyPayment } from "./pyment.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize";

const router = express.Router();

router.post("/make-payment",authenticate, authorize('customer'), makePayment);


export default router;