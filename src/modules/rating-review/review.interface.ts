import { Document, Types } from "mongoose";

export interface IReview extends Document {
  customerId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  menuItemId?: Types.ObjectId;
  orderId: Types.ObjectId;
  rating: number;
  review?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReviewResponse {
  success: boolean;
  message: string;
  data?: IReview | IReview[];
  error?: string;
}

export interface IReviewFilters {
  restaurantId?: string | Types.ObjectId;
  menuItemId?: string | Types.ObjectId;
  userId?: string | Types.ObjectId;
  rating?: number;
  minRating?: number;
  maxRating?: number;
  isVerified?: boolean;
  hasImages?: boolean;
  sortBy?: 'newest' | 'oldest' | 'highest_rating' | 'lowest_rating' | 'most_helpful';
  page?: number;
  limit?: number;
}

export interface IReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  verifiedReviews: number;
  reviewsWithImages: number;
}
