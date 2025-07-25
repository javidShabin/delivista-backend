"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMenuCreation = void 0;
const appError_1 = require("../../utils/appError");
// Validation for menu creation
const validateMenuCreation = (data) => {
    // Destructer menu creation date from interface
    const { productName, description, category, price, sellerId, restaurantId, customerId } = data;
    // Chexk the required fields are present or not
    if (!productName || !description || !category || !price || !sellerId || !restaurantId || !customerId) {
        throw new appError_1.AppError("All fields are required", 400);
    }
};
exports.validateMenuCreation = validateMenuCreation;
