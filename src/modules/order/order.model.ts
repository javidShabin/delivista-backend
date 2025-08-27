import mongoose, { Schema, Document } from "mongoose";
import { IOrder } from "./order.interface";

export interface IOrderModel extends IOrder, Document { }

const orderSchema: Schema<IOrderModel> = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        addressId: { type: Schema.Types.ObjectId, ref: "Address", required: true },
        items: [
            {
                menuId: { type: Schema.Types.ObjectId, ref: "Menu", required: true },
                name: { type: String, required: true },
                quantity: { type: Number, required: true, default: 1 },
                price: { type: Number, required: true },
            },
        ],
        totalAmount: { type: Number, required: true },
        paymentIntentId: { type: String },
        sessionId: { type: String }, // added sessionId field
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
        },
        orderStatus: {
            type: String,
            enum: ["pending", "processing", "completed", "cancelled"],
            default: "pending",
        },
    },
    { timestamps: true }
);

export default mongoose.model<IOrderModel>("Order", orderSchema);
