import { Types } from "mongoose";

// Individual rating interface
export interface IIndividualRating {
  customerId: Types.ObjectId;
  rating: number;
  review: string;
  createdAt: Date;
}

// Restaurant main schema interface
export interface IRestaurant {
  name: string;
  sellerId: Types.ObjectId;
  phone: string;
  address: string;
  cuisine: string[];
  pinCode: string;
  image: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  ratings: number;
  individualRatings: IIndividualRating[];
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
  pinCode: string;
  image: string;
  isOpen?: boolean;
  openTime?: string;
  isVerified?: boolean;
  closeTime?: string;
}
