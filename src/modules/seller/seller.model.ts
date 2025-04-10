import mongoose, { Schema, Document } from "mongoose";
import { ISeller } from "./seller.interface";

export interface ISellerModel extends ISeller, Document {}

const sellerSchema: Schema<ISellerModel> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["seller"],
      default: "seller",
    },
    avatar: {
      type: String,
      default:
        "https://media.istockphoto.com/id/2041572395/vector/blank-avatar-photo-placeholder-icon-vector-illustration.jpg?s=612x612&w=0&k=20&c=wSuiu-si33m-eiwGhXiX_5DvKQDHNS--CBLcyuy68n0=",
    },
  },

  {
    timestamps: true,
  }
);

export default mongoose.model<ISeller>("Seller", sellerSchema);
