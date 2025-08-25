import { Types } from "mongoose";

// Wishlist schema interface
export interface IWishlist {
    productName: string;
    restaurantId: Types.ObjectId;
    customerId: Types.ObjectId;
    category: string;
    price: number;
    image: string;
    isAvailable: boolean;
    isVeg: boolean;
    ratings: number;
}