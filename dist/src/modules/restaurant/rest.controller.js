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
exports.deleteRestaurant = exports.updateRestaurant = exports.toggleRestaurantStatus = exports.getRestaurantBySeller = exports.getRestaurant = exports.adminVerifyingRestaurant = exports.getVerifiedRestaurants = exports.getAllRestaurants = exports.createRestaurant = void 0;
const rest_model_1 = __importDefault(require("./rest.model"));
const rest_service_1 = require("./rest.service");
const appError_1 = require("../../utils/appError");
const rest_validation_1 = require("./rest.validation");
// Create restaurant
const createRestaurant = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Get seller Id from seller authentication
        const sellerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!sellerId) {
            throw next(new appError_1.AppError("Unauthorised access", 404));
        }
        // Validate first restaurant datials
        (0, rest_validation_1.validateRestaurantCreation)(req.body, req.file);
        // Destructer all fields from request body
        const { name, phone, address, cuisine, image, pinCode } = req.body;
        // Check have any restaurant with same name
        const existRestaurant = yield rest_model_1.default.findOne({ name });
        if (existRestaurant) {
            throw next(new appError_1.AppError("Restaurant already exist with same name", 404));
        }
        let uploadImage;
        // If an image file is uploaded
        if (req.file) {
            // Handle the image upload and get the file path
            uploadImage = yield (0, rest_service_1.handleImageUpload)(req.file);
        }
        // Save restaurant data to database
        const restaurant = new rest_model_1.default({
            name,
            phone,
            address,
            cuisine,
            pinCode,
            image: uploadImage,
            sellerId,
        });
        const saveRestaurant = yield restaurant.save();
        res.status(201).json(saveRestaurant);
    }
    catch (error) {
        next(error);
    }
});
exports.createRestaurant = createRestaurant;
// Get all restaurants with pagination
const getAllRestaurants = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1; // default page = 1
        const limit = parseInt(req.query.limit) || 8; // default limit = 8
        const skip = (page - 1) * limit;
        const totalRestaurants = yield rest_model_1.default.countDocuments();
        const restaurants = yield rest_model_1.default.find().skip(skip).limit(limit);
        if (restaurants.length === 0) {
            return next(new appError_1.AppError("No restaurants found", 404));
        }
        res.status(200).json({
            success: true,
            message: "Fetched restaurants",
            currentPage: page,
            totalPages: Math.ceil(totalRestaurants / limit),
            totalRestaurants,
            restaurants,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllRestaurants = getAllRestaurants;
// Get verified restaurants
const getVerifiedRestaurants = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get admin verifyed restaurant list for customers and admin
        const verifiedRestaurants = yield rest_model_1.default.find({ isVerified: true });
        // If not haver any verified restaurants
        if (verifiedRestaurants.length === 0) {
            throw next(new appError_1.AppError("Not have any verified restaurants", 404));
        }
        res.status(200).json({
            success: true,
            message: "Admin verified restaurants",
            verifiedRestaurants,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getVerifiedRestaurants = getVerifiedRestaurants;
// Verification restaurant for admin
const adminVerifyingRestaurant = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Get restaurant id from request params
        const restaurantId = (_a = req.params) === null || _a === void 0 ? void 0 : _a.restaurantId;
        // Check the restuarant id present or not
        if (!restaurantId) {
            return next(new appError_1.AppError("Restaurant id is required", 404));
        }
        // Find restaurant by id
        const isRestaurant = yield rest_model_1.default.findById(restaurantId);
        // Check the restaurant is present
        if (!isRestaurant) {
            return next(new appError_1.AppError("Restaurant not found", 404));
        }
        // Update the verification restaurant
        isRestaurant.isVerified = true;
        yield isRestaurant.save(); // Save that in database
        // Send restaurant as a response
        res.status(200).json({
            success: true,
            message: "Restaurant verified successfully",
            data: isRestaurant,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.adminVerifyingRestaurant = adminVerifyingRestaurant;
// Get restaurant by ID
const getRestaurant = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Get restaurant id from request params
        const restaurantId = (_a = req.params) === null || _a === void 0 ? void 0 : _a.restaurantId;
        // Check the restuarant id present or not
        if (!restaurantId) {
            return next(new appError_1.AppError("Restaurant id is required", 404));
        }
        // Find restaurant by id
        const isRestaurant = yield rest_model_1.default.findById(restaurantId);
        // Check the restaurant is present
        if (!isRestaurant) {
            return next(new appError_1.AppError("Restaurant not found", 404));
        }
        // Send the restaurant details as a response
        res.status(200).json(isRestaurant);
    }
    catch (error) {
        next(error);
    }
});
exports.getRestaurant = getRestaurant;
// Get restarant by seller ID for seller
const getRestaurantBySeller = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Get seller Id from seller authentication
        const sellerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        // Find the restaurant by seller id
        const isRestaurant = yield rest_model_1.default.findOne({ sellerId });
        // If not have any restaurant under the seller return a error
        if (!isRestaurant) {
            throw next(new appError_1.AppError("Restaurant not found", 404));
        }
        // Send as a response
        res.status(200).json(isRestaurant);
    }
    catch (error) {
        next(error);
    }
});
exports.getRestaurantBySeller = getRestaurantBySeller;
// Filter restaurant by menu
// export const getRestaurantByMenu = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {};
// Toggle restaurant status for seller (open or close)
const toggleRestaurantStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Get seller from seller authentication
        const sellerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        // Find the restaurant by seller id
        const isRestaurant = yield rest_model_1.default.findOne({ sellerId });
        // If not get restaurant with same seller id return error
        if (!isRestaurant) {
            throw next(new appError_1.AppError("Restaurant not found", 404));
        }
        // The toggled restaurant open and close
        // Toggle open/close status
        isRestaurant.isOpen = !isRestaurant.isOpen;
        // Save the updated status
        yield isRestaurant.save();
        // Send response
        res.status(200).json({
            success: true,
            message: `Restaurant is now ${isRestaurant.isOpen ? "Open" : "Closed"}`,
            data: { isOpen: isRestaurant.isOpen },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.toggleRestaurantStatus = toggleRestaurantStatus;
// Update restaurant
const updateRestaurant = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { restaurantId } = req.params;
        if (!restaurantId) {
            return next(new appError_1.AppError("Restaurant ID is required", 400));
        }
        // Extract updated fields from request body
        const { name, phone, address, cuisine, pinCode, image, openTime, closeTime, } = req.body;
        // Prepare update object
        const updateData = {
            name,
            phone,
            address,
            cuisine,
            pinCode,
            image,
            openTime,
            closeTime,
        };
        // If image file is uploaded, handle it
        if (req.file) {
            const restaurantImage = yield (0, rest_service_1.handleImageUpload)(req.file);
            updateData.image = restaurantImage;
        }
        // Remove undefined fields to avoid overwriting with undefined
        Object.keys(updateData).forEach((key) => {
            if (updateData[key] === undefined)
                delete updateData[key];
        });
        // Update the restaurant
        const updatedRestaurant = yield rest_model_1.default.findByIdAndUpdate(restaurantId, updateData, {
            new: true,
            runValidators: true,
        });
        if (!updatedRestaurant) {
            return next(new appError_1.AppError("Restaurant not found", 404));
        }
        res.status(200).json({
            success: true,
            message: "Restaurant updated successfully",
            data: updatedRestaurant,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateRestaurant = updateRestaurant;
// Delete restaurant (forAdmin)
const deleteRestaurant = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get restaurant id from request params
        const { restaurantId } = req.params;
        // Check the restaurant id is present or not
        if (!restaurantId) {
            return next(new appError_1.AppError("Restaurant ID is required", 400));
        }
        // Find and delete the restaurant by restaurant id
        const deletedRestaurant = yield rest_model_1.default.findByIdAndDelete(restaurantId);
        if (!deletedRestaurant) {
            return next(new appError_1.AppError("Restaurant not found", 404));
        }
        // Send the delete response
        res.status(200).json({
            success: true,
            message: "Restaurant deleted successfully",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteRestaurant = deleteRestaurant;
