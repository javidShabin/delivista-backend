import mongoose, {Types } from "mongoose";
// Restaurant main schema interface
export interface IRestaurant {
  name: string;
  seller: Types.ObjectId; // Use string instead of ObjectId
  email: string;
  phone: string;
  address: string;
  cuisine: string[];
  image: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
}
// Restaurant creation interface
export interface IRestaurantCreation {
  name: string;
  seller: string;
  email: string;
  phone: string;
  address: string;
  cuisine: string[];
  image?: string;
  isOpen?: boolean;
  openTime?: string;
  closeTime?: string;
}