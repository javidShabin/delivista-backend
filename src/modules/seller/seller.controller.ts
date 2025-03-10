import { Request, Response, NextFunction } from "express";
import tempSellerSchema from "./seller.tempModel";
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
    const tempSeller = await tempSellerSchema.findOneAndUpdate(
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
    );
    // Send the OTP to the seller's email
    await sendOtpEmail(email, otp);
    // Respond with a success message
    res.status(200).json({
      status: "success",
      message: "OTP sent to your email. Please verify to complete signup.",
    });
  } catch (error) {
    next(error);
  }
};

// Verify the OTP and create an seller account
export const verifySellerOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate the OTP and email
    validateSellerOTP(req.body);
    const { email, otp } = req.body;
    // Find the temporary seller record
    const tempSeller = await tempSellerSchema.findOne({ email });
    // Check if the temporary seller exists and the OTP is valid
    if (!tempSeller || tempSeller.otp !== otp) {
      throw new AppError("Invalid OTP or email", 400);
    }
    // Check if the OTP has expired
    if (tempSeller.otpExpires < new Date()) {
      throw new AppError("OTP has expired", 400);
    }
    // Create the seller account with the verified details
    const newSeller = await sellerSchema.create({
      name: tempSeller.name,
      email: tempSeller.email,
      password: tempSeller.password,
      phone: tempSeller.phone,
      role: "seller",
    });
    await newSeller.save();
    // Generate a JWT token for the seller
    const token = generateToken({
      id: newSeller._id.toString(),
      email: newSeller.email,
      role: newSeller.role,
    });
    // Set the token in a cookie
    res.cookie("userToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    // Delete the temporary seller record
    await tempSellerSchema.deleteOne({ email });
    // Respond with the new seller details and token
    res.status(201).json({
      status: "success",
      message: "Seller account created successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Seller login
export const loginSeller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate the seller login data
    validateSellerLogin(req.body);
    const { email, password } = req.body;
    // Find the seller by email
    const isSeller = await sellerSchema.findOne({ email });
    if (!isSeller) {
      throw new AppError("Invalid email or password", 401);
    }
    // Compare the password with the hashed password
    const isPasswordMatch = await comparePassword(password, isSeller.password);
    // Check if the password matches
    if (!isPasswordMatch) {
      return next(new AppError("Invalid email or password", 400));
    }
    // Generate a JWT token for the seller
    const token = generateToken({
      id: isSeller._id.toString(),
      email: isSeller.email,
      role: isSeller.role,
    });
    // Set the token in a cookie
    res.cookie("userToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    // Respond with success message
    res.status(200).json({
      status: "success",
      message: "Seller logged in successfully",
    });
  } catch (error) {
    next(error);
  }
};
