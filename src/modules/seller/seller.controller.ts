import { Request, Response, NextFunction } from "express";
import sellerTempSchema from "./seller.tempModel";
import sellerSchema from "./seller.model";
import {
  comparePassword,
  sendOtpEmail,
  hashPassword,
  handleAvatarUpload,
} from "./seller.service";
import { AppError } from "../../utils/appError";
import { generateToken } from "../../utils/generateToken";
import {
  validateSignupSeller,
  validateSellerOTP,
  validateSellerLogin,
  validateSellerPassword,
} from "./seller.validation";

// Generate OTP for seller signup 
// Send the OTP to the seller's email
export const signupSeller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate the seller signup data
    validateSignupSeller(req.body);
    
    const { name, email, password, phone } = req.body;
    // Check if the seller already exists
    const existingSeller = await sellerSchema.findOne({ email });
    if (existingSeller) {
      throw new AppError("Seller already exists", 400);
    }
    // Hash the password
    const hashedPassword = await hashPassword(password);
    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Create a temporary seller record with the OTP
    const tempSeller = await sellerTempSchema.findOneAndUpdate(
      { email },
        {
            name,
            email,
            password: hashedPassword,
            phone,
            otp,
            otpExpires: new Date(Date.now() + 10 * 60 * 1000), // OTP expires in 10 minutes
        },
        { upsert: true, new: true }
    )
  } catch (error) {
    next(error);
  }
};
