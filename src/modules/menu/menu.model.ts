import mongoose, { Schema, Document } from "mongoose";
import { IMenu } from "./menu.interface";

// Combines interface with mongoose's Document
export interface IMenuModel extends IMenu, Document {}

const menuSchema: Schema<IMenuModel> = new Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Appetizers",
        "Main Course",
        "Desserts",
        "Beverages",
        "Salads",
        "Snacks",
        "Soups",
        "Sides",
        "Specials",
        "Combos",
        "Vegan",
        "Gluten-Free",
        "Non-Vegetarian",
        "Vegetarian",
        "Breakfast",
        "Brunch",
        "Lunch",
        "Dinner",
        "Drinks",
        "Alcoholic Beverages",
      ],
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    variants: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    image: {
      type: String,
      default: "",
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isVeg: {
      type: Boolean,
      default: false,
    },
    isRecommended: {
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
    tags: [
      {
        type: String,
        trim: true,
        enum: [
          "Spicy",
          "Sweet",
          "Savory",
          "Tangy",
          "Crunchy",
          "Creamy",
          "Healthy",
          "Organic",
          "Gluten-Free",
          "Vegan",
          "Vegetarian",
          "Non-Vegetarian",
          "Popular",
          "New Arrival",
          "Chef's Special",
        ],
      },
    ],
    totalOrders: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Create the menu model
export default mongoose.model<IMenuModel>("Menu", menuSchema);
