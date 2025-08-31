import mongoose, { Schema, Document, model } from "mongoose";
import { IOrder } from "./order.interface";

export interface IOrderModel extends IOrder, Document {}

// Order schema
const orderSchema = new Schema<IOrderModel>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sellerId: {type: Schema.Types.ObjectId, ref: "Seller", required: true},
    sessionId: { type: String, required: true },

    // Address
    addressId: { type: Schema.Types.ObjectId, ref: "Address", required: true },
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    addressType: { type: String, required: true },

    // Items in the order
    items: [
      {
        menuId: { type: Schema.Types.ObjectId, ref: "Menu", required: true },
        productName: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        isVeg: { type: Boolean, required: true },
        tags: [{ type: String }],
        category: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],

    // Pricing
    totalAmount: { type: Number, required: true },

    // Payment & order status
    paymentStatus: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    transactionId: { type: String },
    orderStatus: {
      type: String,
      enum: ["placed", "confirmed", "delivered", "cancelled"],
      default: "placed",
    },

  },
  { timestamps: true }
);

export default model<IOrderModel>("Order", orderSchema);
