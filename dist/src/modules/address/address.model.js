"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Address schema
const addressSchema = new mongoose_1.Schema({
    customerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    addressType: {
        type: String,
        enum: ["home", "work", "other"],
        required: true,
    },
    isDefault: { type: Boolean, default: false },
}, { timestamps: true });
// Create the model for the schema
exports.default = (0, mongoose_1.model)("Address", addressSchema);
