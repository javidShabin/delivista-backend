import { Types } from "mongoose";

// Subschema for cart items
interface ICartItem {
  menuItem: Types.ObjectId;
  quantity: number;
  price: number;
  image?: string;
  productName: string;
  category: string;
  isVeg: boolean;
}

// Cart main schema interface
export interface ICart {
  sellerId: Types.ObjectId;
  customerId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  items: ICartItem[];
  totalPrice: number;
  orderStatus: "pending" | "in-progress" | "completed";
  createdAt: Date;
  updatedAt: Date;
}
