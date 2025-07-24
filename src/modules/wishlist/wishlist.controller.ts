import { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/appError";
import { validateWishlistCreation } from "./wishlist.validation";
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
        console.log(userId)
        if (!userId) {
            return next(new AppError("Unauthorized", 401));
        }
        console.log(userId)
        // // Get all datas from request body
        const {menuId } = req.body;
        // Find the menu item using name
        const isMenuItem = await menuSchema.findById(menuId)
        res.send(isMenuItem)



    } catch (error: any) {
        return next(error);
    }
};
