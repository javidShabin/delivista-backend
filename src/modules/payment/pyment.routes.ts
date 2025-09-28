import express from "express";
import { makePayment, verifyPayment } from "./pyment.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/authorize";
import { orderCancel, orderListByCustomer, orderListBySeller, singleOrder } from "./order.controller";

const router = express.Router();

router.post("/make-payment",authenticate, authorize('customer'), makePayment);
router.post("/verify-payment",authenticate, authorize('customer'), verifyPayment);

// ************************************************************************************
// ***************** Ordre routes ***************************
router.get('/get-all-orders', authenticate, authorize('customer'),orderListByCustomer)
router.get('/single-order/:orderId', authenticate, authorize("customer"), singleOrder)
router.put('/cancel-order/:orderId', authenticate, authorize("customer"), orderCancel)
router.get('/get-orders', authenticate, authorize("seller"), orderListBySeller)


export default router;