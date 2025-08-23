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
exports.getAddressByStatus = exports.getAllAddresses = exports.setDefaultAddress = exports.deleteAddress = exports.updateAddress = exports.createAddress = void 0;
const address_model_1 = __importDefault(require("./address.model"));
const appError_1 = require("../../utils/appError");
const address_validation_1 = require("./address.validation");
// ********************* Address CRUD Operation **********************
// Create address
const createAddress = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const customerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // assuming user is stored in req.user after auth middleware
        if (!customerId) {
            return next(new appError_1.AppError("Unauthorized: customerId missing", 401));
        }
        // Validate request body
        (0, address_validation_1.validateAddress)(req.body);
        const { fullName, phoneNumber, address, city, state, pincode, addressType, isDefault } = req.body;
        // If isDefault is true, set all previous addresses isDefault = false
        if (isDefault) {
            yield address_model_1.default.updateMany({ customerId }, { $set: { isDefault: false } });
        }
        // Create new address
        const newAddress = yield address_model_1.default.create({
            customerId,
            fullName,
            phoneNumber,
            address,
            city,
            state,
            pincode,
            addressType,
            isDefault: isDefault || false,
        });
        res.status(201).json({
            success: true,
            message: "Address created successfully",
            data: newAddress,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createAddress = createAddress;
// Update address (without editing isDefault)
const updateAddress = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Get the user id from authentication
        const customerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const addressId = req.params.addressId; // Get the address id from parameter
        // Check the user id is present or not
        if (!customerId) {
            return next(new appError_1.AppError("Unauthorized: customerId missing", 401));
        }
        // Destructure allowed fields
        const { fullName, phoneNumber, address, city, state, pincode, addressType, } = req.body;
        // Prepare update object (no isDefault here)
        const updateFields = {
            fullName,
            phoneNumber,
            address,
            city,
            state,
            pincode,
            addressType,
        };
        // find and update the address
        const updatedAddress = yield address_model_1.default.findOneAndUpdate({ _id: addressId, customerId }, { $set: updateFields }, { new: true, runValidators: true });
        if (!updatedAddress) {
            return next(new appError_1.AppError("Address not found or not authorized", 404));
        }
        res.status(200).json({
            success: true,
            message: "Address updated successfully",
            data: updatedAddress,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateAddress = updateAddress;
// Delete address
const deleteAddress = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const customerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const addressId = req.params.addressId;
        if (!customerId) {
            return next(new appError_1.AppError("Unauthorized: customerId missing", 401));
        }
        const deletedAddress = yield address_model_1.default.findOneAndDelete({
            _id: addressId,
            customerId,
        });
        if (!deletedAddress) {
            return next(new appError_1.AppError("Address not found or not authorized", 404));
        }
        res.status(200).json({
            success: true,
            message: "Address deleted successfully",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteAddress = deleteAddress;
// ***************** Update default and get all address ********************
// Set address as default
const setDefaultAddress = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const customerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const addressId = req.params.addressId;
        if (!customerId) {
            return next(new appError_1.AppError("Unauthorized: customerId missing", 401));
        }
        // First reset all to false
        yield address_model_1.default.updateMany({ customerId }, { $set: { isDefault: false } });
        // Then set this one to true
        const updated = yield address_model_1.default.findOneAndUpdate({ _id: addressId, customerId }, { $set: { isDefault: true } }, { new: true });
        if (!updated) {
            return next(new appError_1.AppError("Address not found or not authorized", 404));
        }
        res.status(200).json({
            success: true,
            message: "Default address updated successfully",
            data: updated,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.setDefaultAddress = setDefaultAddress;
// Get all addresses by user (latest first)
const getAllAddresses = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const customerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // from auth middleware
        if (!customerId) {
            return next(new appError_1.AppError("Unauthorized: customerId missing", 401));
        }
        const addresses = yield address_model_1.default.find({ customerId }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: addresses.length,
            data: addresses,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllAddresses = getAllAddresses;
// Get default address details
const getAddressByStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const customerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!customerId) {
            return next(new appError_1.AppError("Unauthorized: customerId missing", 401));
        }
        // Find the default address
        const defaultAddress = yield address_model_1.default.findOne({
            customerId,
            isDefault: true,
        });
        if (!defaultAddress) {
            return next(new appError_1.AppError("No default address found", 404));
        }
        res.status(200).json({
            success: true,
            message: "Default address fetched successfully",
            data: defaultAddress,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAddressByStatus = getAddressByStatus;
