import { Types } from "mongoose";
// Veriane interface
interface Variant {
  name: string;
  price: number;
}
// Menu schema interface
export interface IMenu {
  productName: string;
  restaurantId: Types.ObjectId;
  description: string;
  category: string;
  price: number;
  variants?: Variant[];
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
