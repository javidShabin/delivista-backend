import { Types } from "mongoose";

// Wishlist schema interface
export interface IWishlist {
    menuId: Types.ObjectId;
    productName: string;
    restaurantId: Types.ObjectId;
    customerId: Types.ObjectId;
    category: string;
    price: number;
    image: string;
    isAvailable: boolean;
    isVeg: boolean;
    ratings: number;
    isFav: boolean;
}

// Create wishlist interface
export interface IWishlistCreation {
    menuId: Types.ObjectId;
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
