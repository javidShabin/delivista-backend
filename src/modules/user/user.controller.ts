import { Request, Response, NextFunction } from "express";
import tempUserSchema from "./user.tempModel";
import userSchema from "./user.model";
import { hashPassword, sendOtpEmail } from "./user.service";
import { AppError } from "../../utils/appError";
import { validateSignupUser, validateUserOTP } from "./user.validation";
import { generateToken } from "../../utils/generateToken";

// Generate and send OTP to user email
// Send OTP using node mailer to user email
export const signupUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate the user details in validator function
    validateSignupUser(req.body);
    const { name, email, password, phone } = req.body;
    // Check the user is already exist in database
    const existingUser = await userSchema.findOne({ email });
    if (existingUser) return next(new AppError("User already exists", 400));

    // Hash the user password
    const hashedPassword = await hashPassword(password);
    // Generate the 6 digit OTP using math function
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Create the tempUser
    await tempUserSchema.findOneAndUpdate(
      { email },
      {
        name,
        email,
        password: hashedPassword, // add the hash password
        phone,
        otp,
        otpExpires: new Date(Date.now() + 10 * 60000), // add the expire data for OTP
      },
      { upsert: true, new: true }
    );
    await sendOtpEmail(email, otp);
    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    next(error);
  }
};

// Verify the OTP and create a new user
export const verifyOtpAndCreateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate the OTP and email
    validateUserOTP(req.body);

    const { email, otp } = req.body;

    // Check if the temp user exists
    const tempUser = await tempUserSchema.findOne({ email });
    if (!tempUser) {
      return next(new AppError("User does not exist or OTP expired", 404));
    }

    // Check if OTP matches
    if (tempUser.otp !== otp) {
      return next(new AppError("Invalid OTP", 400));
    }

    // Check if OTP is expired
    if (tempUser.otpExpires.getTime() < Date.now()) {
      return next(new AppError("OTP has expired", 400));
    }

    // Create and save the new user
    const newUser = new userSchema({
      name: tempUser.name,
      email: tempUser.email,
      password: tempUser.password,
      phone: tempUser.phone,
      role: tempUser.role,
      avatar: tempUser.avatar,
    });

    await newUser.save();

    // Generate JWT token
    const token = generateToken({
      id: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role,
    });
    // Set the token to cookie
    res.cookie("userToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    // Delete the tempUser after signup
    await tempUser.deleteOne({ email });

    // Respond with success and token
    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Log in the user
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
  
  } catch (error) {
    
  }
};
// Get users list
export const getAllUsers = (req: Request, res: Response) => {};
// Get user by user ID
export const getUserById = (req: Request, res: Response) => {};
// Get user profile using user ID
export const getUserProfileById = (req: Request, res: Response) => {};
// Update user profile by user ID
export const updateUserProfile = (req: Request, res: Response) => {};
// Forgot password
export const forgotPassword = (req: Request, res: Response) => {};
// Log out user
export const logoutUser = (req: Request, res: Response) => {};
