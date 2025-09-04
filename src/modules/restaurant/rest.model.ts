import mongoose, { Schema, Document } from "mongoose";
import { IRestaurant } from "./rest.interface";

// Combines your interface with Mongoose's Document
export interface IRestaurantModel extends IRestaurant, Document {}

const restaurantSchema: Schema<IRestaurantModel> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    cuisine: [
      {
        type: String,
        required: true,
      },
    ],
    pinCode: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    openTime: {
      type: String,
      default: "09:00",
    },
    closeTime: {
      type: String,
      default: "23:00",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    ratings: {
      type: Number,
      default: 0.0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IRestaurantModel>("Restaurant", restaurantSchema);
