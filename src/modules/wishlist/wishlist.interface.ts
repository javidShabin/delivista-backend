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

// Create wishlist interface
export interface IWishlistCreation {
    productName: string;
    restaurantId: string;
    category: string;
    price: number;
    image?: string;
    isAvailable?: boolean;
    isVeg?: boolean;
    ratings?: number;
}

// Remove wishlist item interface
export interface IRemoveWishlistItem {
    wishlistItemId: string;
}
