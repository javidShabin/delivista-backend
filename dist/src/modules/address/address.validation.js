"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAddress = void 0;
const appError_1 = require("../../utils/appError");
// Validation for address creation
const validateAddress = (data) => {
    // Destructer the address details from the data
    const { fullName, phoneNumber, address, city, state, pincode, addressType } = data;
    // Check all fields are present or not
    if (!fullName || !phoneNumber || !address || !city || !state || !pincode || !addressType) {
        throw new appError_1.AppError("All fields are required", 400);
    }
};
exports.validateAddress = validateAddress;
