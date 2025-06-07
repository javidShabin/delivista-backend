import { Request, Response, NextFunction } from "express";
import tempAdminSchema from "./admin.tempModel";
import adminSchema from "./admin.model";
import {
  comparePassword,
  handleAvatarUpload,
  hashPassword,
  sendOtpEmail,
} from "./admin.service";
import { AppError } from "../../utils/appError";
import { generateToken } from "../../utils/generateToken";
import cloudinary from "../../configs/cloudinary";
import {
  validateAdminLogin,
  validateAdminOTP,
  validateAdminSignup,
} from "./admin.validation";

// Generate and send OTP to admin email
// Send OTP using node mailer to admin email
export const signupAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate the admin signup data from request body
    validateAdminSignup(req.body);
    // Destructure the admin details from request body
    const { name, email, password, phone } = req.body;
    // Check if the admin already exists in the database
    const existingAdmin = await adminSchema.findOne({ email });
    if (existingAdmin) return next(new AppError("Admin already exists", 400));
    // Hash the password using bcrypt
    const hashedPassword = await hashPassword(password);
    // Generate the 6 digit OTP using math function
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Create a temporary admin document with the provided details
    await tempAdminSchema.findOneAndUpdate(
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
    // Send the OTP to the admin's email
    await sendOtpEmail(email, otp);
    res.status(200).json({
      status: "success",
      message: "OTP sent to your email",
    });
  } catch (error) {
    next(error);
  }
};

// Verify the OTP and create an admin account
export const verifyAdminOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate the OTP and email
    validateAdminOTP(req.body);
    // Destructure the email and OTP from request body
    const { email, otp } = req.body;
    // Find the temporary admin document by email
    const tempAdmin = await tempAdminSchema.findOne({ email });
    // Check if the temporary admin exists and the OTP is valid
    if (!tempAdmin || tempAdmin.otp !== otp) {
      return next(new AppError("Invalid OTP or email", 400));
    }
    // Check if the OTP has expired
    if (tempAdmin.otpExpires < new Date()) {
      return next(new AppError("OTP has expired", 400));
    }
    // Create and save the new admin
    const newAdmin = await adminSchema.create({
      name: tempAdmin.name,
      email: tempAdmin.email,
      password: tempAdmin.password,
      phone: tempAdmin.phone,
      role: "admin",
    });
    await newAdmin.save();

    // Generate a JWT token
    const token = generateToken({
      id: newAdmin._id.toString(),
      email: newAdmin.email,
      role: newAdmin.role,
    });
    // Set the token in a cookie
    res.cookie("userToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    // Delete the temporary admin document
    await tempAdminSchema.deleteOne({ email });
    // Respond with success response
    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Admin login
export const loginAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate the user login details
    validateAdminLogin(req.body);
    // Destructure the email and password from request body
    const { email, password } = req.body;
    // Find the admin by email
    const isAdminExist = await adminSchema.findOne({ email });
    // Check if the admin exists
    if (!isAdminExist) {
      return next(new AppError("Invalid email or password", 400));
    }
    // Compare the password with the hashed password
    const isPasswordMatch = await comparePassword(
      password,
      isAdminExist.password
    );
    // Check if the password matches
    if (!isPasswordMatch) {
      return next(new AppError("Invalid email or password", 400));
    }
    // Generate a JWT token
    const token = generateToken({
      id: isAdminExist._id.toString(),
      email: isAdminExist.email,
      role: isAdminExist.role,
    });
    // Set the token in a cookie
    res.cookie("userToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    // Respond with success response
    res.status(200).json({
      success: true,
      message: "Admin logged in successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get the admin profile
export const getAdminProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the admin ID from authenticated user
    const adminId = req.user?.id;
    // Check if the admin ID is provided
    if (!adminId) {
      return next(new AppError("Admin ID is required", 400));
    }
    // Find the admin by ID
    const adminProfile = await adminSchema
      .findById(adminId)
      .select("-password");
    // Check if the admin exists
    if (!adminProfile) {
      return next(new AppError("Admin not found", 404));
    }
    // Respond with the admin profile
    res.status(200).json({
      success: true,
      adminProfile,
    });
  } catch (error) {
    next(error);
  }
};

// Update the admin profile
export const updateAdminProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get user Id form req.user
    const id = req.user?.id;
    // Check user Id present or not
    if (!id) {
      return next(new AppError("Unauthorized access", 401));
    }
    // Extract the admin details from request body
    const { name, email, phone, avatar } = req.body;
    // Prepare the update object
    const updateData: any = { name, email, phone, avatar };
    // Check if an avatar file is uploaded
    if (req.file) {
      let adminAvatar = await handleAvatarUpload(req.file); // Handler from admin.service.ts
      // Update the avatar URL in the update object
      updateData.avatar = adminAvatar;
    }
    // Find the admin by ID and update the profile
    const updatedAdmin = await adminSchema.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    // Check if the admin exists
    if (!updatedAdmin) {
      return next(new AppError("Admin not found", 404));
    }
    // Respond with the updated admin profile
    res.status(200).json({
      success: true,
      message: "Admin profile updated successfully",
      updatedAdmin,
    });
  } catch (error) {
    next(error);
  }
};
