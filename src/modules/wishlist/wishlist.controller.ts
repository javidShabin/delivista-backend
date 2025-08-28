import { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/appError";
import { validateWishlistCreation, validateRemoveWishlistItem } from "./wishlist.validation";
import {
    addToWishlistService,
    getAllWishlistByUserIdService,
    removeWishlistItemService,
    checkWishlistItemExistsService
} from "./wishlist.service";

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

        // Validate the data from request body
        validateWishlistCreation(req.body);

        // Add item to wishlist
        const newWishlistItem = await addToWishlistService(userId, req.body);

        res.status(201).json({
            status: "success",
            message: "Item added to wishlist successfully",
            data: newWishlistItem
        });
    } catch (error: any) {
        if (error.message === "Item already exists in wishlist") {
            return next(new AppError("Item already exists in wishlist", 400));
        }
        console.log(error);
        return next(error);
    }
};

// Get all wishlist items by user ID
export const getAllWishlistByUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Get customer id from user authentication
        const userId = req.user?.id;
        if (!userId) {
            return next(new AppError("Unauthorized", 401));
        }

        // Get wishlist items
        const wishlistItems = await getAllWishlistByUserIdService(userId);

        res.status(200).json({
            status: "success",
            message: "Wishlist items retrieved successfully",
            data: wishlistItems,
            count: wishlistItems.length
        });
    } catch (error) {
        console.log(error);
        return next(error);
    }
};

// Remove item from wishlist
export const removeWishlistItem = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Get user id from authentication
        const userId = req.user?.id;
        if (!userId) {
            return next(new AppError("Unauthorized", 401));
        }

        // Validate the request body
        validateRemoveWishlistItem(req.body);

        const { wishlistItemId } = req.body;

        // Remove item from wishlist
        const deletedItem = await removeWishlistItemService(userId, wishlistItemId);

        res.status(200).json({
            status: "success",
            message: "Item removed from wishlist successfully",
            data: deletedItem
        });
    } catch (error: any) {
        if (error.message === "Wishlist item not found or unauthorized") {
            return next(new AppError("Wishlist item not found or unauthorized", 404));
        }
        console.log(error);
        return next(error);
    }
};

// Check if item exists in wishlist (optional endpoint)
export const checkWishlistItem = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Get user id from authentication
        const userId = req.user?.id;
        if (!userId) {
            return next(new AppError("Unauthorized", 401));
        }

        const { restaurantId, productName } = req.query;

        if (!restaurantId || !productName) {
            return next(new AppError("Restaurant ID and product name are required", 400));
        }

        // Check if item exists in wishlist
        const existingItem = await checkWishlistItemExistsService(
            userId,
            restaurantId as string,
            productName as string
        );

        res.status(200).json({
            status: "success",
            exists: !!existingItem,
            data: existingItem || null
        });
    } catch (error) {
        console.log(error);
        return next(error);
    }
};
