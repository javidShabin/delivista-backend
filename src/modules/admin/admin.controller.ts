import { Request, Response, NextFunction } from "express";
import tempAdminSchema from "./admin.tempModel";
import adminSchema from "./admin.model";
import { comparePassword, hashPassword, sendOtpEmail } from "./admin.service";
import { AppError } from "../../utils/appError";
import { generateToken } from "../../utils/generateToken";
import cloudinary from "../../configs/cloudinary";
import { validateAdminOTP, validateAdminSignup } from "./admin.validation";

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

   
  } catch (error) {}
};
