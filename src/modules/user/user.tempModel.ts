import mongoose, { Schema, Document } from "mongoose";
import {ITempUser} from "./user.interface"

export interface ITempUserModel extends ITempUser, Document {}

const tempUserSchema: Schema<ITempUserModel> = new Schema(
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
    otp: {
      type: String,
      required: true,
    },
    otpExpires: {
      type: Date,
      required: true,
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

export default mongoose.model<ITempUser>("TempUser", tempUserSchema);
