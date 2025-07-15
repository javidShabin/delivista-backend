"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCartCreation = void 0;
const appError_1 = require("../../utils/appError");
// Validation for cart creation
const validateCartCreation = (data) => {
    // Destructer the cart details as data from interface
    const { sellerId, customerId, restaurantId, items } = data;
    // Check all fields are present or not
    if (!sellerId || !customerId || !restaurantId || !items) {
        throw new appError_1.AppError("All fields are required", 400);
    }
};
exports.validateCartCreation = validateCartCreation;
