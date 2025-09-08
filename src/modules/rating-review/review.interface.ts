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
