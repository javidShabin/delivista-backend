import { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/appError";
import { validateWishlistCreation } from "./wishlist.validation";
import wishlistSchema from "./wishlist.model";


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

        // Get all datas from request body
        const { productName, restaurantId, category, image, price } = req.body;

        // Find the menu item using name



    } catch (error: any) {
        return next(error);
    }
};
