import mongoose, { Schema, Document } from "mongoose";
import { IWishlist } from "./wishlist.interface";

export interface IWishlistModel extends IWishlist, Document { }

const wishlistSchema: Schema<IWishlistModel> = new Schema(
    {
        menuId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Menu",
            required: true,
        },
        productName: {
            type: String,
            required: true,
            trim: true,
        },
        restaurantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant",
            required: true,
        },
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        category: {
            type: String,
            required: true,
            enum: [
                "Appetizers",
                "Main Course",
                "Desserts",
                "Beverages",
                "Salads",
                "Snacks",
                "Soups",
                "Sides",
                "Specials",
                "Combos",
                "Vegan",
                "Gluten-Free",
                "Non-Vegetarian",
                "Vegetarian",
                "Breakfast",
                "Brunch",
                "Lunch",
                "Dinner",
                "Drinks",
                "Alcoholic Beverages",
            ],
            trim: true,
        },
        price: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
            default: "",
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
        isVeg: {
            type: Boolean,
            default: false,
        },
        ratings: {
            type: Number,
            default: 0.0,
        },
    },
    {timestamps: true}
)
// Create the wishlist model
export default mongoose.model<IWishlistModel>("wishlist", wishlistSchema)