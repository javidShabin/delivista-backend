import mongoose, { Schema, Document } from "mongoose";
import {IUser}  from "./user.interface";

export interface IuserModel extends IUser, Document {}

const userSchema: Schema<IuserModel> = new Schema(
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
    role: {
      type: String,
      enum: ["user", "admin", "seller"],
      default: "user",
    },
    avatar: {
      public_id: String,
      url: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("User", userSchema);
