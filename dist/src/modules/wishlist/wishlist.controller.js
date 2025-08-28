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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkWishlistItem = exports.removeWishlistItem = exports.getAllWishlistByUserId = exports.addToWishlist = void 0;
const appError_1 = require("../../utils/appError");
const wishlist_validation_1 = require("./wishlist.validation");
const wishlist_service_1 = require("./wishlist.service");
// Add item to wishlist
const addToWishlist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Ensure customerId comes from the authenticated user
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return next(new appError_1.AppError("Unauthorized", 401));
        }
        // Validate the data from request body
        (0, wishlist_validation_1.validateWishlistCreation)(req.body);
        // Add item to wishlist
        const newWishlistItem = yield (0, wishlist_service_1.addToWishlistService)(userId, req.body);
        res.status(201).json({
            status: "success",
            message: "Item added to wishlist successfully",
            data: newWishlistItem
        });
    }
    catch (error) {
        if (error.message === "Item already exists in wishlist") {
            return next(new appError_1.AppError("Item already exists in wishlist", 400));
        }
        console.log(error);
        return next(error);
    }
});
exports.addToWishlist = addToWishlist;
// Get all wishlist items by user ID
const getAllWishlistByUserId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Get customer id from user authentication
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return next(new appError_1.AppError("Unauthorized", 401));
        }
        // Get wishlist items
        const wishlistItems = yield (0, wishlist_service_1.getAllWishlistByUserIdService)(userId);
        res.status(200).json({
            status: "success",
            message: "Wishlist items retrieved successfully",
            data: wishlistItems,
            count: wishlistItems.length
        });
    }
    catch (error) {
        console.log(error);
        return next(error);
    }
});
exports.getAllWishlistByUserId = getAllWishlistByUserId;
// Remove item from wishlist
const removeWishlistItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Get user id from authentication
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return next(new appError_1.AppError("Unauthorized", 401));
        }
        // Validate the request body
        (0, wishlist_validation_1.validateRemoveWishlistItem)(req.body);
        const { wishlistItemId } = req.body;
        // Remove item from wishlist
        const deletedItem = yield (0, wishlist_service_1.removeWishlistItemService)(userId, wishlistItemId);
        res.status(200).json({
            status: "success",
            message: "Item removed from wishlist successfully",
            data: deletedItem
        });
    }
    catch (error) {
        if (error.message === "Wishlist item not found or unauthorized") {
            return next(new appError_1.AppError("Wishlist item not found or unauthorized", 404));
        }
        console.log(error);
        return next(error);
    }
});
exports.removeWishlistItem = removeWishlistItem;
// Check if item exists in wishlist (optional endpoint)
const checkWishlistItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Get user id from authentication
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return next(new appError_1.AppError("Unauthorized", 401));
        }
        const { restaurantId, productName } = req.query;
        if (!restaurantId || !productName) {
            return next(new appError_1.AppError("Restaurant ID and product name are required", 400));
        }
        // Check if item exists in wishlist
        const existingItem = yield (0, wishlist_service_1.checkWishlistItemExistsService)(userId, restaurantId, productName);
        res.status(200).json({
            status: "success",
            exists: !!existingItem,
            data: existingItem || null
        });
    }
    catch (error) {
        console.log(error);
        return next(error);
    }
});
exports.checkWishlistItem = checkWishlistItem;
