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