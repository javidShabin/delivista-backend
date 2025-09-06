import { AppError } from "../../utils/appError";

// Validation for creating a review
export const validateCreateReview = (data: any) => {
  const { restaurantId, orderId, rating, reviewText, images, menuItemId } = data;

  // Check required fields
  if (!restaurantId || !orderId || !rating) {
    throw new AppError("Restaurant ID, Order ID, and rating are required", 400);
  }

  // Validate ObjectId format (24 character hex string)
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!objectIdRegex.test(restaurantId)) {
    throw new AppError("Invalid restaurant ID format", 400);
  }
  if (!objectIdRegex.test(orderId)) {
    throw new AppError("Invalid order ID format", 400);
  }
  if (menuItemId && !objectIdRegex.test(menuItemId)) {
    throw new AppError("Invalid menu item ID format", 400);
  }

  // Validate rating
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new AppError("Rating must be a whole number between 1 and 5", 400);
  }

  // Validate review text length
  if (reviewText && reviewText.length > 1000) {
    throw new AppError("Review text cannot exceed 1000 characters", 400);
  }

  // Validate images
  if (images && Array.isArray(images)) {
    if (images.length > 5) {
      throw new AppError("Maximum 5 images allowed per review", 400);
    }
    // Basic URL validation
    const urlRegex = /^https?:\/\/.+/;
    for (const image of images) {
      if (typeof image !== 'string' || !urlRegex.test(image)) {
        throw new AppError("Each image must be a valid URL", 400);
      }
    }
  }
};

// Validation for updating a review
export const validateUpdateReview = (data: any) => {
  const { rating, reviewText, images } = data;

  // Validate rating if provided
  if (rating !== undefined) {
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new AppError("Rating must be a whole number between 1 and 5", 400);
    }
  }

  // Validate review text length if provided
  if (reviewText !== undefined && reviewText.length > 1000) {
    throw new AppError("Review text cannot exceed 1000 characters", 400);
  }

  // Validate images if provided
  if (images !== undefined && Array.isArray(images)) {
    if (images.length > 5) {
      throw new AppError("Maximum 5 images allowed per review", 400);
    }
    // Basic URL validation
    const urlRegex = /^https?:\/\/.+/;
    for (const image of images) {
      if (typeof image !== 'string' || !urlRegex.test(image)) {
        throw new AppError("Each image must be a valid URL", 400);
      }
    }
  }
};

// Validation for query parameters
export const validateGetReviews = (query: any) => {
  const { restaurantId, menuItemId, userId, rating, minRating, maxRating, page, limit } = query;

  // Validate ObjectId formats
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (restaurantId && !objectIdRegex.test(restaurantId)) {
    throw new AppError("Invalid restaurant ID format", 400);
  }
  if (menuItemId && !objectIdRegex.test(menuItemId)) {
    throw new AppError("Invalid menu item ID format", 400);
  }
  if (userId && !objectIdRegex.test(userId)) {
    throw new AppError("Invalid user ID format", 400);
  }

  // Validate rating filters
  if (rating !== undefined) {
    const ratingNum = Number(rating);
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      throw new AppError("Rating must be a whole number between 1 and 5", 400);
    }
  }
  if (minRating !== undefined) {
    const minRatingNum = Number(minRating);
    if (!Number.isInteger(minRatingNum) || minRatingNum < 1 || minRatingNum > 5) {
      throw new AppError("Minimum rating must be a whole number between 1 and 5", 400);
    }
  }
  if (maxRating !== undefined) {
    const maxRatingNum = Number(maxRating);
    if (!Number.isInteger(maxRatingNum) || maxRatingNum < 1 || maxRatingNum > 5) {
      throw new AppError("Maximum rating must be a whole number between 1 and 5", 400);
    }
  }

  // Validate pagination
  if (page !== undefined) {
    const pageNum = Number(page);
    if (!Number.isInteger(pageNum) || pageNum < 1) {
      throw new AppError("Page must be a positive integer", 400);
    }
  }
  if (limit !== undefined) {
    const limitNum = Number(limit);
    if (!Number.isInteger(limitNum) || limitNum < 1 || limitNum > 100) {
      throw new AppError("Limit must be an integer between 1 and 100", 400);
    }
  }
};

// Validation for review stats parameters
export const validateReviewStats = (params: any) => {
  const { restaurantId, menuItemId } = params;

  if (!restaurantId && !menuItemId) {
    throw new AppError("Either restaurantId or menuItemId is required", 400);
  }

  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (restaurantId && !objectIdRegex.test(restaurantId)) {
    throw new AppError("Invalid restaurant ID format", 400);
  }
  if (menuItemId && !objectIdRegex.test(menuItemId)) {
    throw new AppError("Invalid menu item ID format", 400);
  }
};