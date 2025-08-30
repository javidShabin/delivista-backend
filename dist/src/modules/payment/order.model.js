"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Order schema
const orderSchema = new mongoose_1.Schema({
    customerId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    sessionId: { type: String, required: true },
    // Address
    addressId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Address", required: true },
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    addressType: { type: String, required: true },
    // Items in the order
    items: [
        {
            menuId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Menu", required: true },
            productName: { type: String, required: true },
            quantity: { type: Number, required: true },
            image: { type: String, required: true },
            isVeg: { type: Boolean, required: true },
            tags: [{ type: String }],
            category: { type: String, required: true },
            price: { type: Number, required: true },
        },
    ],
    // Pricing
    totalAmount: { type: Number, required: true },
    // Payment & order status
    paymentStatus: {
        type: String,
        enum: ["pending", "success", "failed"],
        default: "pending",
    },
    transactionId: { type: String },
    orderStatus: {
        type: String,
        enum: ["placed", "confirmed", "shipped", "delivered", "cancelled"],
        default: "placed",
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Order", orderSchema);
