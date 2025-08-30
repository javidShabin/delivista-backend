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
exports.clearAllItems = exports.removeFavItem = exports.getFavListbyUserId = exports.addToWishlist = void 0;
const appError_1 = require("../../utils/appError");
const wishlist_model_1 = __importDefault(require("./wishlist.model"));
const menu_model_1 = __importDefault(require("../menu/menu.model"));
// Add item to wishlist
const addToWishlist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Ensure customerId comes from the authenticated user
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return next(new appError_1.AppError("Unauthorized", 401));
        }
        // Get menuId from request body
        const { menuId } = req.body;
        if (!menuId) {
            return next(new appError_1.AppError("Menu ID is required", 400));
        }
        // Find the menu item by ID
        const menuItem = yield menu_model_1.default.findById(menuId);
        if (!menuItem) {
            return next(new appError_1.AppError("Menu item not found", 404));
        }
        // Check if item already exists in wishlist
        const existingItem = yield wishlist_model_1.default.findOne({
            menuId: menuItem._id,
            customerId: userId,
        });
        if (existingItem) {
            return next(new appError_1.AppError("Already add to wishlist", 400));
        }
        // Prepare wishlist entry
        const wishlistItem = new wishlist_model_1.default({
            menuId: menuItem._id,
            productName: menuItem.productName,
            restaurantId: menuItem.restaurantId,
            customerId: userId, // from logged-in user
            category: menuItem.category,
            price: menuItem.price,
            image: menuItem.image,
            isAvailable: menuItem.isAvailable,
            isVeg: menuItem.isVeg,
            ratings: menuItem.ratings,
        });
        // Save wishlist item
        yield wishlistItem.save();
        res.status(201).json({
            status: "success",
            message: "Item added to wishlist",
            data: wishlistItem,
        });
    }
    catch (error) {
        return next(error);
    }
});
exports.addToWishlist = addToWishlist;
// Get favorite list by user id
const getFavListbyUserId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Get user id from authentication
        const customerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!customerId) {
            return next(new appError_1.AppError("User not authenticated", 401));
        }
        // Find the list of favorite items from db
        const favItemList = yield wishlist_model_1.default.find({ customerId });
        if (!favItemList || favItemList.length === 0) {
            return next(new appError_1.AppError("No items found in favorites", 404));
        }
        // Send response
        res.status(200).json({
            status: "success",
            results: favItemList.length,
            data: favItemList,
        });
    }
    catch (error) {
        console.error(error);
        return next(new appError_1.AppError("Error fetching favorite list", 500));
    }
});
exports.getFavListbyUserId = getFavListbyUserId;
// Remove items from favorites list
const removeFavItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Ensure customerId comes from the authenticated user
        const customerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!customerId) {
            return next(new appError_1.AppError("User not authenticated", 401));
        }
        // Get the wishlist item id or menuId from request params/body
        const { menuId } = req.body; // Or req.params.id if you pass via URL
        if (!menuId) {
            return next(new appError_1.AppError("Menu ID is required", 400));
        }
        // Find the wishlist item
        const wishlistItem = yield wishlist_model_1.default.findOneAndDelete({
            menuId,
            customerId,
        });
        if (!wishlistItem) {
            return next(new appError_1.AppError("Item not found in wishlist", 404));
        }
        // Send response
        res.status(200).json({
            status: "success",
            message: "Item removed from wishlist",
            data: wishlistItem,
        });
    }
    catch (error) {
        console.error(error);
        return next(new appError_1.AppError("Error removing item from wishlist", 500));
    }
});
exports.removeFavItem = removeFavItem;
// Clear the all list
const clearAllItems = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Get user id from authentication
        const customerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!customerId) {
            return next(new appError_1.AppError("User not authenticated", 401));
        }
        // Remove all list from schema using delete many method
        yield wishlist_model_1.default.deleteMany({ customerId });
        // Add resposne to client
        res.status(200).json({
            status: "success",
            message: "All items cleared from wishlist",
            data: [],
        });
    }
    catch (error) {
        console.error(error);
        return next(new appError_1.AppError("Error clearing wishlist", 500));
    }
});
exports.clearAllItems = clearAllItems;
