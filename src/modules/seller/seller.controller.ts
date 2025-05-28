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

// Get the all seller list
export const getAllSellers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Fetch all sellers from the database
    const sellers = await sellerSchema.find({}).select("-password");
    // Check if there are no sellers
    if (!sellers) {
      return next(new AppError("No sellers found", 404));
    }
    // Respond with the list of sellers
    res.status(200).json({ sellers });
  } catch (error) {
    next(error);
  }
};

// Get seller profile
export const getSellerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the seller ID from then authenticated user
    const sellerId = req.user?.id;
    // Check if the seller ID is provided
    if (!sellerId) {
      return next(new AppError("Seller ID is required", 400));
    }
    // Find the seller by ID
    const sellerProfile = await sellerSchema
      .findById(sellerId)
      .select("-password");
    // Check if the seller exists
    if (!sellerProfile) {
      return next(new AppError("Seller not found", 404));
    }
    // Respond with the seller profile
    res.status(200).json({ sellerProfile });
  } catch (error) {
    next(error);
  }
};

// Update seller profile
export const updateSellerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the seller ID from the authenticated user
    const sellerId = req.user?.id;
    // Check if the seller ID is provided
    if (!sellerId) {
      return next(new AppError("Seller ID is required", 400));
    }

    // Extract the updated data from the request body
    const { name, email, phone, avatar } = req.body;
    // Prepare the update date
    const updateData: any = {
      name,
      email,
      phone,
      avatar,
    };

    // Check if an avatar file is uploaded
    if (req.file) {
      // Handle the avatar upload and get the file path
      const avatarPath = await handleAvatarUpload(req.file);
      // Update the avatar path in the update data
      updateData.avatar = avatarPath;
    }
    // Update the seller profile in the database
    const updatedSeller = await sellerSchema.findByIdAndUpdate(
      sellerId,
      updateData,
      {
        new: true,
      }
    );
    // Handle the case where the seller is not found
    if (!updatedSeller) {
      return next(new AppError("Seller not found", 404));
    }
    // Respond with the updated seller profile
    res.status(200).json({
      status: "success",
      message: "Seller profile updated successfully",
      updatedSeller,
    });
  } catch (error) {
    next(error);
  }
};

// Seller forgot password generating
export const generateFogotPassOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Destructer email from request body
    const { email } = req.body;
    // CHeck email present or not
    if (!email) {
      return next(new AppError("Email is required", 400));
    }
    // Find the seller by email
    const isSeller = await sellerSchema.findOne({ email });
    if (!isSeller) {
      return next(new AppError("Seller not found", 404));
    }
    // Generate 6-digit OTP for password reset
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await tempSellerSchema.findOneAndUpdate(
      { email },
      {
        otp,
        otpExpires: Date.now() + 10 * 60 * 1000,
      },
      { upsert: true, new: true }
    );
    // Set up email message details
    await sendOtpEmail(email, otp);
    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    next(error);
  }
};

// Verify the OTP and reset password
export const verifyForgotPasswordOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate the email and otp
    validateSellerOTP(req.body);
    // Destructer the email and OTP from request body
    const { email, otp } = req.body;
    // Find the temp seller by email, and check the seller is present
    const tempSeller = await tempSellerSchema.findOne({ email });
    if (!tempSeller) {
      return next(new AppError("Seller not found", 404));
    }
    // Compare the OTP
    if (tempSeller.otp !== otp) {
      return next(new AppError("Invalid OTP", 400));
    }
    // Send success respone
    res.status(200).json({
      message: "OTP verified successfully. You can now change your password.",
    });
  } catch (error) {
    next(error);
  }
};

// Update the seller password
export const updateSellerPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate the password
    validateSellerPassword(req.body);
    // Destructer the email , password and verify the password
    const { email, password } = req.body;
    // Find the tempSeller by email
    const isTempSeller = await tempSellerSchema.findOne({ email });
    // Check if the admin exists
    if (!isTempSeller) {
      return next(new AppError("Seller not found", 404));
    }
    // Hash the new password
    const hashedPassword = await hashPassword(password);
    // Update the seller password in the seller schema
    await sellerSchema.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );
    // Delete the temporary seller document
    await tempSellerSchema.deleteOne({ email });
    // Respond with success response
    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    next(error);
  }
};
