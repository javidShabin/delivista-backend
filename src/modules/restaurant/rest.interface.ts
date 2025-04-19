import {Types } from "mongoose";
// Restaurant main schema interface
export interface IRestaurant {
  name: string;
  sellerId: Types.ObjectId;
  phone: string;
  address: string;
  cuisine: string[];
  image: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  totalReviews: number;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
// Restaurant creation interface
export interface IRestaurantCreation {
  name: string;
  phone: string;
  address: string;
  cuisine: string[];
  image: string;
  isOpen?: boolean;
  openTime?: string;
  isVerified?: boolean;
  closeTime?: string;
}