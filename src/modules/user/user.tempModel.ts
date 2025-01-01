import mongoose, { Schema, Document } from "mongoose";

export interface ITempUser extends Document {
  name: string;
  email: string;
  password: string;
  otp: string;
  otpExpires: Date;
  role: "user" | "admin" | "seller";
  avatar?: {
    public_id: string;
    url: string;
  };
  createdAt: Date;
}

const tempUserSchema: Schema<ITempUser> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
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
