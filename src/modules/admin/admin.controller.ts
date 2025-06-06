import { Request, Response, NextFunction } from "express";
import tempAdminSchema from "./admin.tempModel";
import adminSchema from "./admin.model";
import { comparePassword, hashPassword, sendOtpEmail } from "./admin.service";
import { AppError } from "../../utils/appError";
import { generateToken } from "../../utils/generateToken";
import cloudinary from "../../configs/cloudinary";
import { validateAdminSignup } from "./admin.validation";

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
