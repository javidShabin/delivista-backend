"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRestaurantCreation = void 0;
const appError_1 = require("../../utils/appError");
// Validation for restaurant creation
const validateRestaurantCreation = (data, file) => {
    // Destructer all fileds from data
    const { name, phone, address, cuisine, pinCode } = data;
    // Check all fields are present or not
    if (!name || !phone || !address || !cuisine || !pinCode) {
        throw new appError_1.AppError("All fields are required", 400);
    }
    if (!file) {
        throw new appError_1.AppError("Image file is required", 400);
    }
};
exports.validateRestaurantCreation = validateRestaurantCreation;
