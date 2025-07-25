import { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/appError";
import wishlistSchema from "./wishlist.model";
import menuSchema from "../menu/menu.model";


// Add item to wishlist
export const addToWishlist = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Ensure customerId comes from the authenticated user
        const userId = req.user?.id;
        if (!userId) {
            return next(new AppError("Unauthorized", 401));
        }

        // Get menuId from request body
        const { menuId } = req.body;
        if (!menuId) {
            return next(new AppError("Menu ID is required", 400));
        }

        // Find the menu item by ID
        const menuItem = await menuSchema.findById(menuId);
        if (!menuItem) {
            return next(new AppError("Menu item not found", 404));
        }

        // Check if item already exists in wishlist
        const existingItem = await wishlistSchema.findOne({
            menuId: menuItem._id,
            customerId: userId,
        });

        if (existingItem) {
            return next(new AppError("Already add to wishlist", 400))
        }
        // Prepare wishlist entry
        const wishlistItem = new wishlistSchema({
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
        await wishlistItem.save();

        res.status(201).json({
            status: "success",
            message: "Item added to wishlist",
            data: wishlistItem,
        });

    } catch (error: any) {
        return next(error);
    }
};

// Get favorite list by user id
export const getFavListbyUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get user id from authentication
        const userId = req.user?.id;

        if (!userId) {
            return next(new AppError("User not authenticated", 401));
        }

        // Find the list of favorite items from db
        const favItemList = await wishlistSchema.find( {userId} ).populate("menuId");
        console.log(favItemList)

        if (!favItemList || favItemList.length === 0) {
            return next(new AppError("No items found in favorites", 404));
        }

        // Send response
        res.status(200).json({
            status: "success",
            results: favItemList.length,
            data: favItemList,
        });

    } catch (error) {
        console.error(error);
        return next(new AppError("Error fetching favorite list", 500));
    }
};

// Remove items from favorites list
export const removeFavItem = async (req: Request, res: Response, next: NextFunction) => {
    try {

    } catch (error) {

    }
}

// Clear all item
export const clearAllItems = async (req: Request, res: Response, next: NextFunction) => {
    try {

    } catch (error) {

    }
}
