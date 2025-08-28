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
exports.checkWishlistItemExistsService = exports.removeWishlistItemService = exports.getAllWishlistByUserIdService = exports.addToWishlistService = void 0;
const wishlist_model_1 = __importDefault(require("./wishlist.model"));
const mongoose_1 = require("mongoose");
// Add item to wishlist
const addToWishlistService = (customerId, wishlistData) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if item already exists in user's wishlist
    const existingItem = yield wishlist_model_1.default.findOne({
        customerId: new mongoose_1.Types.ObjectId(customerId),
        restaurantId: new mongoose_1.Types.ObjectId(wishlistData.restaurantId),
        productName: wishlistData.productName
    });
    if (existingItem) {
        throw new Error("Item already exists in wishlist");
    }
    // Create new wishlist item
    const newWishlistItem = yield wishlist_model_1.default.create(Object.assign(Object.assign({}, wishlistData), { customerId: new mongoose_1.Types.ObjectId(customerId), restaurantId: new mongoose_1.Types.ObjectId(wishlistData.restaurantId) }));
    return newWishlistItem;
});
exports.addToWishlistService = addToWishlistService;
// Get all wishlist items by user ID
const getAllWishlistByUserIdService = (customerId) => __awaiter(void 0, void 0, void 0, function* () {
    const wishlistItems = yield wishlist_model_1.default
        .find({ customerId: new mongoose_1.Types.ObjectId(customerId) })
        .populate('restaurantId', 'name address')
        .sort({ createdAt: -1 });
    return wishlistItems;
});
exports.getAllWishlistByUserIdService = getAllWishlistByUserIdService;
// Remove item from wishlist
const removeWishlistItemService = (customerId, wishlistItemId) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedItem = yield wishlist_model_1.default.findOneAndDelete({
        _id: new mongoose_1.Types.ObjectId(wishlistItemId),
        customerId: new mongoose_1.Types.ObjectId(customerId)
    });
    if (!deletedItem) {
        throw new Error("Wishlist item not found or unauthorized");
    }
    return deletedItem;
});
exports.removeWishlistItemService = removeWishlistItemService;
// Check if item exists in wishlist
const checkWishlistItemExistsService = (customerId, restaurantId, productName) => __awaiter(void 0, void 0, void 0, function* () {
    const existingItem = yield wishlist_model_1.default.findOne({
        customerId: new mongoose_1.Types.ObjectId(customerId),
        restaurantId: new mongoose_1.Types.ObjectId(restaurantId),
        productName: productName
    });
    return existingItem;
});
exports.checkWishlistItemExistsService = checkWishlistItemExistsService;
