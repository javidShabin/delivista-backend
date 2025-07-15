import { Types } from "mongoose";

// Cart main schema interface
export interface ICart {
  sellerId: Types.ObjectId;
  customerId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  items: [
    {
      menuId: Types.ObjectId;
      quantity: number;
      price: number;
      image?: string;
      productName: string;
      category: string;
      isVeg: boolean;
    }
  ];
  totalPrice: number;
  orderStatus: "pending" | "in-progress" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

// Create cart interface
export interface ICartCreation {
  sellerId: Types.ObjectId;
  customerId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  items: [
    {
      menuId: Types.ObjectId;
      quantity: number;
      price: number;
      image?: string;
      productName: string;
      category: string;
      isVeg: boolean;
    }
  ];
  totalPrice: number;
}
