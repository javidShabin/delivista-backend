import { Request, Response, NextFunction } from "express";
import reviewSchema from "./review.model";
import restaurantSchema from "../restaurant/rest.model";
import customerSchema from "../authentication/auth.model";
import orderSchema from "../payment/order.model";
import { AppError } from "../../utils/appError";

// Add review and rating for the restaurants
export const ratingRestaurant = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get customer id from authentication
    const customerId = req.user?.id;

    // Destructure the details from request body
    const { sellerId, orderId, rating, review } = req.body;

    if (!sellerId || !orderId || rating === undefined || !review) {
      return next(new AppError("All fields are required", 404));
    }

    const user = await customerSchema.findById(customerId);

    // Find the restaurant by seller id
    const restaurant = await restaurantSchema.findOne({ sellerId });

    if (!restaurant) {
      return next(new AppError("Restaurant not found", 404));
    }

    // Update restaurant ratings and total reviews
    restaurant.ratings = rating;
    restaurant.totalReviews = (restaurant.totalReviews || 0) + 1;
    await restaurant.save();

    // Find the current order
    const currentOrder = await orderSchema.findById(orderId);

    if (!currentOrder) {
      return next(new AppError("Order not found", 404));
    }

    // Safely assign and save
    currentOrder.isReviewed = true;
    await currentOrder.save();


    // Create and save new review
    const newReview = new reviewSchema({
      customerId,
      restaurantId: restaurant._id,
      orderId,
      rating,
      review,
      avatar: user?.avatar,
    });

    await newReview.save();

    res.status(201).json({
      status: "success",
      message: "Review added successfully",
      data: newReview,
    });

  } catch (error) {
    next(error);
  }
};
