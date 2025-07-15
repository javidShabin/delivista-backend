import mongoose, { Schema, Document, model } from "mongoose";
import { ICart } from "./cart.interface";

export interface ICartModel extends ICart, Document {}

// Main Cart schema
const cartSchema = new Schema<ICartModel>(
  {
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    items: {
      type: [
        {
          menuId: {
            type: Schema.Types.ObjectId,
            ref: "MenuItem",
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
            min: 1,
          },
          price: {
            type: Number,
            required: true,
            min: 0,
          },
          image: {
            type: String,
          },
          productName: {
            type: String,
            required: true,
          },
          category: {
            type: String,
            required: true,
          },
          isVeg: {
            type: Boolean,
            required: true,
          },
        },
      ],
      required: true,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    orderStatus: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Create model
export default model<ICartModel>("Cart", cartSchema);
