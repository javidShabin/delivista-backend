"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRemoveWishlistItem = exports.validateWishlistCreation = void 0;
const appError_1 = require("../../utils/appError");
// Validation for wishlist creation
const validateWishlistCreation = (data) => {
    const { menuId, productName, restaurantId, category, image, price } = data;
    // Check required fields
    if (!menuId || !productName || !restaurantId || !category || !image || price === undefined) {
        throw new appError_1.AppError("Product name, restaurant ID, category, and price are required", 400);
    }
    // Validate price
    if (typeof price !== 'number' || price <= 0) {
        throw new appError_1.AppError("Price must be a positive number", 400);
    }
    // Validate category
    const validCategories = [
        "Appetizers", "Main Course", "Desserts", "Beverages", "Salads",
        "Snacks", "Soups", "Sides", "Specials", "Combos", "Vegan",
        "Gluten-Free", "Non-Vegetarian", "Vegetarian", "Breakfast",
        "Brunch", "Lunch", "Dinner", "Drinks", "Alcoholic Beverages"
    ];
    if (!validCategories.includes(category)) {
        throw new appError_1.AppError("Invalid category", 400);
    }
    // Validate restaurantId format (ObjectId)
    if (!/^[0-9a-fA-F]{24}$/.test(restaurantId)) {
        throw new appError_1.AppError("Invalid restaurant ID format", 400);
    }
};
exports.validateWishlistCreation = validateWishlistCreation;
// Validation for removing wishlist item
const validateRemoveWishlistItem = (data) => {
    const { wishlistItemId } = data;
    if (!wishlistItemId) {
        throw new appError_1.AppError("Wishlist item ID is required", 400);
    }
    // Validate wishlistItemId format (ObjectId)
    if (!/^[0-9a-fA-F]{24}$/.test(wishlistItemId)) {
        throw new appError_1.AppError("Invalid wishlist item ID format", 400);
    }
};
exports.validateRemoveWishlistItem = validateRemoveWishlistItem;
