"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPayment = exports.makePayment = void 0;
const order_model_1 = __importDefault(require("./order.model"));
const address_model_1 = __importDefault(require("../address/address.model"));
const stripe_1 = require("../../configs/stripe");
const makePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const customerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { addressId, items, totalAmount, sellerId } = req.body;
        // Find the user details from db
        const isAddress = yield address_model_1.default.findById(addressId);
        // 1. Create Stripe Checkout Session
        const session = yield stripe_1.stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: items.map((item) => ({
                price_data: {
                    currency: "inr", // or "usd"
                    product_data: {
                        name: item.productName,
                        images: [item.image],
                    },
                    unit_amount: Math.round(item.price * 1.05 * 100),
                },
                quantity: item.quantity,
            })),
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/user/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/user/payment-failed`,
        });
        // 2. Save pending order
        const order = yield order_model_1.default.create({
            customerId,
            sellerId,
            sessionId: session.id,
            addressId,
            fullName: isAddress === null || isAddress === void 0 ? void 0 : isAddress.fullName,
            address: isAddress === null || isAddress === void 0 ? void 0 : isAddress.address,
            city: isAddress === null || isAddress === void 0 ? void 0 : isAddress.city,
            phoneNumber: isAddress === null || isAddress === void 0 ? void 0 : isAddress.phoneNumber,
            addressType: isAddress === null || isAddress === void 0 ? void 0 : isAddress.addressType,
            items,
            totalAmount,
            paymentStatus: "pending",
            orderStatus: "placed",
        });
        res.status(200).json({
            success: true,
            url: session.url,
            orderId: order._id,
        });
    }
    catch (error) {
        console.error("Payment error:", error, "errprrrrrr");
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.makePayment = makePayment;
const verifyPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { session_id } = req.query;
        if (!session_id) {
            res.status(400).json({ success: false, message: "Session ID missing" });
        }
        // 1. Retrieve session details from Stripe
        const session = yield stripe_1.stripe.checkout.sessions.retrieve(session_id);
        // 2. Update order in DB
        const order = yield order_model_1.default.findOneAndUpdate({ sessionId: session.id }, {
            paymentStatus: session.payment_status === "paid" ? "success" : "failed",
            transactionId: session.payment_intent,
            orderStatus: session.payment_status === "paid" ? "confirmed" : "cancelled",
        }, { new: true });
        res.status(200).json({ success: true, order });
    }
    catch (error) {
        console.error("Verify payment error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.verifyPayment = verifyPayment;
