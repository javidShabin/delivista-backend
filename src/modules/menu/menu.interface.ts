import { Types } from "mongoose";

// Menu schema interface
export interface IMenu {
  productName: string;
  restaurantId: Types.ObjectId;
  sellerId: Types.ObjectId;
  description: string;
  category: string;
  price: number;
  image: string;
  isAvailable: boolean;
  isVeg: boolean;
  isRecommended: boolean;
  ratings: number;
  totalReviews: number;
  tags: string[];
  totalOrders: number;
  createdAt: Date;
  updatedAt: Date;
}

// Create menu interface
export interface IMenuCreation {
  restaurantId: Types.ObjectId;
  sellerId: Types.ObjectId;
  productName: string;
  description: string;
  category: string;
  price: number;
}