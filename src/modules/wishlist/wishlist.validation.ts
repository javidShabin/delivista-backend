import { AppError } from "../../utils/appError";
import { IWishlistCreation, IRemoveWishlistItem } from "./wishlist.interface";

// Validation for wishlist creation
export const validateWishlistCreation = (data: IWishlistCreation) => {
    const {menuId, productName, restaurantId, category,image, price } = data;
    
    // Check required fields
    if (!menuId ||!productName || !restaurantId || !category || !image || price === undefined) {
        throw new AppError("Product name, restaurant ID, category, and price are required", 400);
    }
    
    // Validate price
    if (typeof price !== 'number' || price <= 0) {
        throw new AppError("Price must be a positive number", 400);
    }
    
    // Validate category
    const validCategories = [
        "Appetizers", "Main Course", "Desserts", "Beverages", "Salads",
        "Snacks", "Soups", "Sides", "Specials", "Combos", "Vegan",
        "Gluten-Free", "Non-Vegetarian", "Vegetarian", "Breakfast",
        "Brunch", "Lunch", "Dinner", "Drinks", "Alcoholic Beverages"
    ];
    
    if (!validCategories.includes(category)) {
        throw new AppError("Invalid category", 400);
    }
    
    // Validate restaurantId format (ObjectId)
    if (!/^[0-9a-fA-F]{24}$/.test(restaurantId)) {
        throw new AppError("Invalid restaurant ID format", 400);
    }
};

// Validation for removing wishlist item
export const validateRemoveWishlistItem = (data: IRemoveWishlistItem) => {
    const { wishlistItemId } = data;
    
    if (!wishlistItemId) {
        throw new AppError("Wishlist item ID is required", 400);
    }
    
    // Validate wishlistItemId format (ObjectId)
    if (!/^[0-9a-fA-F]{24}$/.test(wishlistItemId)) {
        throw new AppError("Invalid wishlist item ID format", 400);
    }
};
