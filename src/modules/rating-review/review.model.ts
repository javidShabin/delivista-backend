import mongoose, { Schema, Document } from "mongoose";
import { IReview } from "./review.interface";

// Combines interface with mongoose's Document
export interface IReviewModel extends IReview, Document {}

const reviewSchema: Schema<IReviewModel> = new Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    menuItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menu",
      required: false,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: 'Rating must be a whole number between 1 and 5'
      }
    },
    review: {
      type: String,
      maxlength: 1000,
      trim: true,
    },
    avatar: {
        type: String
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create the review model
export default mongoose.model<IReviewModel>("Review", reviewSchema);
