import wishlistSchema from "./wishlist.model";
import { IWishlistCreation } from "./wishlist.interface";
import { Types } from "mongoose";

// Add item to wishlist
export const addToWishlistService = async (
    customerId: string,
    wishlistData: IWishlistCreation
) => {
    // Check if item already exists in user's wishlist
    const existingItem = await wishlistSchema.findOne({
        customerId: new Types.ObjectId(customerId),
        restaurantId: new Types.ObjectId(wishlistData.restaurantId),
        productName: wishlistData.productName
    });

    if (existingItem) {
        throw new Error("Item already exists in wishlist");
    }

    // Create new wishlist item
    const newWishlistItem = await wishlistSchema.create({
        ...wishlistData,
        customerId: new Types.ObjectId(customerId),
        restaurantId: new Types.ObjectId(wishlistData.restaurantId)
    });

    return newWishlistItem;
};

// Get all wishlist items by user ID
export const getAllWishlistByUserIdService = async (customerId: string) => {
    const wishlistItems = await wishlistSchema
        .find({ customerId: new Types.ObjectId(customerId) })
        .populate('restaurantId', 'name address')
        .sort({ createdAt: -1 });

    return wishlistItems;
};

// Remove item from wishlist
export const removeWishlistItemService = async (
    customerId: string,
    wishlistItemId: string
) => {
    const deletedItem = await wishlistSchema.findOneAndDelete({
        _id: new Types.ObjectId(wishlistItemId),
        customerId: new Types.ObjectId(customerId)
    });

    if (!deletedItem) {
        throw new Error("Wishlist item not found or unauthorized");
    }

    return deletedItem;
};

// Check if item exists in wishlist
export const checkWishlistItemExistsService = async (
    customerId: string,
    restaurantId: string,
    productName: string
) => {
    const existingItem = await wishlistSchema.findOne({
        customerId: new Types.ObjectId(customerId),
        restaurantId: new Types.ObjectId(restaurantId),
        productName: productName
    });

    return existingItem;
};
