"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Main Cart schema
const cartSchema = new mongoose_1.Schema({
    sellerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Seller",
        required: true,
    },
    customerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    restaurantId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
    },
    items: {
        type: [
            {
                menuId: {
                    type: mongoose_1.Schema.Types.ObjectId,
                    ref: "MenuItem",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                price: {
                    type: Number,
                    required: true,
                    min: 0,
                },
                image: {
                    type: String,
                },
                productName: {
                    type: String,
                    required: true,
                },
                category: {
                    type: String,
                    required: true,
                },
                isVeg: {
                    type: Boolean,
                    required: true,
                },
            },
        ],
        required: true,
    },
    totalPrice: {
        type: Number,
        default: 0,
    },
    orderStatus: {
        type: String,
        enum: ["pending", "in-progress", "completed"],
        default: "pending",
    },
}, {
    timestamps: true,
});
// Create model
exports.default = (0, mongoose_1.model)("Cart", cartSchema);
