import { Request, Response, NextFunction } from "express";
import Review from "./review.model";
import Restaurant from "../restaurant/rest.model";
import Menu from "../menu/menu.model";
import { AppError } from "../../utils/appError";

// ******************************* Restaurnts and menu item review and raitng functions ****************************
// ******************************************************************************************************************

// Add review and rating for the restaurnats
export const ratingRestaurant = async (req: Request,
  res: Response,
  next: NextFunction) => {
  try {
    const customerId = req.user?.id
    const { sellerId, menuItemId, orderId, rating, review } = req.body

    if (!sellerId || !menuItemId || !orderId) {
      res.status(404).json({ messge: "all fields are required" })
    }

    console.log(customerId, sellerId, menuItemId, orderId)
  } catch (error) {
    next(error)
  }
}