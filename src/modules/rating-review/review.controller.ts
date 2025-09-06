import { Request, Response } from "express";
import Review from "./review.model";
import Restaurant from "../restaurant/rest.model";
import Menu from "../menu/menu.model";
import { IReview, IReviewResponse, IReviewFilters, IReviewStats } from "./review.interface";
import { AppError } from "../../utils/appError";

export class ReviewController {
  // Create a new review
  static async createReview(req: Request, res: Response): Promise<void> {
    try {
      const { restaurantId, menuItemId, orderId, rating, reviewText, images } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError("User not authenticated", 401);
      }

      // Validate required fields
      if (!restaurantId || !orderId || !rating) {
        throw new AppError("Restaurant ID, Order ID, and rating are required", 400);
      }

      // Check if restaurant exists
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
        throw new AppError("Restaurant not found", 404);
      }

      // Check if menu item exists (if provided)
      if (menuItemId) {
        const menuItem = await Menu.findById(menuItemId);
        if (!menuItem) {
          throw new AppError("Menu item not found", 404);
        }
      }

      // Check if user has already reviewed this restaurant/order
      const existingReview = await Review.findOne({
        userId,
        restaurantId,
        orderId,
        ...(menuItemId && { menuItemId })
      });

      if (existingReview) {
        throw new AppError("You have already reviewed this order", 400);
      }

      // Create new review
      const review = new Review({
        userId,
        restaurantId,
        menuItemId: menuItemId || undefined,
        orderId,
        rating,
        reviewText: reviewText || undefined,
        images: images || []
      });

      await review.save();

      // Update restaurant ratings
      await this.updateRestaurantRatings(restaurantId);

      // Update menu item ratings if applicable
      if (menuItemId) {
        await this.updateMenuItemRatings(menuItemId);
      }

      const response: IReviewResponse = {
        success: true,
        message: "Review created successfully",
        data: review
      };

      res.status(201).json(response);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal server error",
        error: error.message
      });
    }
  }

  // Get reviews with filters
  static async getReviews(req: Request, res: Response): Promise<void> {
    try {
      const {
        restaurantId,
        menuItemId,
        userId,
        rating,
        minRating,
        maxRating,
        hasImages,
        sortBy = 'newest',
        page = 1,
        limit = 10
      } = req.query;

      const filters: any = {};

      if (restaurantId) filters.restaurantId = restaurantId;
      if (menuItemId) filters.menuItemId = menuItemId;
      if (userId) filters.userId = userId;
      if (rating) filters.rating = rating;
      if (minRating || maxRating) {
        filters.rating = {};
        if (minRating) filters.rating.$gte = minRating;
        if (maxRating) filters.rating.$lte = maxRating;
      }
      if (hasImages === 'true') filters.images = { $exists: true, $not: { $size: 0 } };

      const sortOptions: any = {};
      switch (sortBy) {
        case 'newest':
          sortOptions.createdAt = -1;
          break;
        case 'oldest':
          sortOptions.createdAt = 1;
          break;
        case 'highest_rating':
          sortOptions.rating = -1;
          break;
        case 'lowest_rating':
          sortOptions.rating = 1;
          break;
        default:
          sortOptions.createdAt = -1;
      }

      const skip = (Number(page) - 1) * Number(limit);

      const reviews = await Review.find(filters)
        .populate('userId', 'name email')
        .populate('restaurantId', 'name')
        .populate('menuItemId', 'productName')
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit));

      const totalReviews = await Review.countDocuments(filters);

      const response: IReviewResponse = {
        success: true,
        message: "Reviews retrieved successfully",
        data: reviews as any
      };

      res.status(200).json({
        ...response,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(totalReviews / Number(limit)),
          totalReviews,
          hasNext: skip + reviews.length < totalReviews,
          hasPrev: Number(page) > 1
        }
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal server error",
        error: error.message
      });
    }
  }

  // Get review statistics
  static async getReviewStats(req: Request, res: Response): Promise<void> {
    try {
      const { restaurantId, menuItemId } = req.params;

      if (!restaurantId && !menuItemId) {
        throw new AppError("Restaurant ID or Menu Item ID is required", 400);
      }

      const filters: any = {};
      if (restaurantId) filters.restaurantId = restaurantId;
      if (menuItemId) filters.menuItemId = menuItemId;

      const reviews = await Review.find(filters);
      
      if (reviews.length === 0) {
        const stats: IReviewStats = {
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
          verifiedReviews: 0,
          reviewsWithImages: 0
        };

        res.status(200).json({
          success: true,
          message: "Review statistics retrieved successfully",
          data: stats
        });
        return;
      }

      const totalReviews = reviews.length;
      const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

      const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      reviews.forEach(review => {
        ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
      });

      const reviewsWithImages = reviews.filter(review => review.images && review.images.length > 0).length;

      const stats: IReviewStats = {
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews,
        ratingDistribution,
        verifiedReviews: totalReviews, // Assuming all reviews are verified for now
        reviewsWithImages
      };

      res.status(200).json({
        success: true,
        message: "Review statistics retrieved successfully",
        data: stats
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal server error",
        error: error.message
      });
    }
  }

  // Update a review
  static async updateReview(req: Request, res: Response): Promise<void> {
    try {
      const { reviewId } = req.params;
      const { rating, reviewText, images } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError("User not authenticated", 401);
      }

      const review = await Review.findOne({ _id: reviewId, userId });
      if (!review) {
        throw new AppError("Review not found or you don't have permission to update it", 404);
      }

      // Update fields
      if (rating !== undefined) review.rating = rating;
      if (reviewText !== undefined) review.reviewText = reviewText;
      if (images !== undefined) review.images = images;

      await review.save();

      // Update ratings
      await this.updateRestaurantRatings(review.restaurantId.toString());
      if (review.menuItemId) {
        await this.updateMenuItemRatings(review.menuItemId.toString());
      }

      const response: IReviewResponse = {
        success: true,
        message: "Review updated successfully",
        data: review
      };

      res.status(200).json(response);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal server error",
        error: error.message
      });
    }
  }

  // Delete a review
  static async deleteReview(req: Request, res: Response): Promise<void> {
    try {
      const { reviewId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError("User not authenticated", 401);
      }

      const review = await Review.findOne({ _id: reviewId, userId });
      if (!review) {
        throw new AppError("Review not found or you don't have permission to delete it", 404);
      }

      const restaurantId = review.restaurantId.toString();
      const menuItemId = review.menuItemId?.toString();

      await Review.findByIdAndDelete(reviewId);

      // Update ratings
      await this.updateRestaurantRatings(restaurantId);
      if (menuItemId) {
        await this.updateMenuItemRatings(menuItemId);
      }

      res.status(200).json({
        success: true,
        message: "Review deleted successfully"
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal server error",
        error: error.message
      });
    }
  }

  // Get a single review
  static async getReview(req: Request, res: Response): Promise<void> {
    try {
      const { reviewId } = req.params;

      const review = await Review.findById(reviewId)
        .populate('userId', 'name email')
        .populate('restaurantId', 'name')
        .populate('menuItemId', 'productName');

      if (!review) {
        throw new AppError("Review not found", 404);
      }

      const response: IReviewResponse = {
        success: true,
        message: "Review retrieved successfully",
        data: review as any
      };

      res.status(200).json(response);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal server error",
        error: error.message
      });
    }
  }

  // Helper method to update restaurant ratings
  private static async updateRestaurantRatings(restaurantId: string): Promise<void> {
    const reviews = await Review.find({ restaurantId });
    
    if (reviews.length === 0) {
      await Restaurant.findByIdAndUpdate(restaurantId, {
        ratings: 0,
        totalReviews: 0
      });
      return;
    }

    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    
    await Restaurant.findByIdAndUpdate(restaurantId, {
      ratings: Math.round(averageRating * 10) / 10,
      totalReviews: reviews.length
    });
  }

  // Helper method to update menu item ratings
  private static async updateMenuItemRatings(menuItemId: string): Promise<void> {
    const reviews = await Review.find({ menuItemId });
    
    if (reviews.length === 0) {
      await Menu.findByIdAndUpdate(menuItemId, {
        ratings: 0,
        totalReviews: 0
      });
      return;
    }

    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    
    await Menu.findByIdAndUpdate(menuItemId, {
      ratings: Math.round(averageRating * 10) / 10,
      totalReviews: reviews.length
    });
  }
}