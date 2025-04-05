import express from "express";
import { makePayment, verifyPayment } from "./pyment.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize";
import { orderListByCustomer } from "./order.controller";

const router = express.Router();

router.post("/make-payment",authenticate, authorize('customer'), makePayment);
router.post("/verify-payment",authenticate, authorize('customer'), verifyPayment);

// ************************************************************************************
// ***************** Ordre routes ***************************
router.get('/get-all-orders', authenticate, authorize('customer'),orderListByCustomer)


export default router;