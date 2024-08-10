import { Request, Response, NextFunction } from "express";
import tempUserSchema from "./user.tempModel";
import userSchema from "./user.model";
import { hashPassword, sendOtpEmail } from "./user.service";
import { AppError } from "../../utils/appError";
import { validateSignupUser, validateUserOTP } from "./user.validation";

// Generate and send OTP to user email
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
    // Validate the OTP and user email in validator function
    validateUserOTP(req.body);
    // Destructer the emial and otp from request body
    const { email, otp } = req.body;
    // Find the temporary user usigng email
    const tempUser = await tempUserSchema.findOne({email})
    if (!tempUser) {
      return next(new AppError("User already exists", 400))
    }
    // Compare the OTP 
    if (tempUser.otp !== otp) {
      return next(new AppError("invalid OTP", 400))
    }
    // Check the OTP expire or not
    if (tempUser.otpExpires.getTime() < Date.now()) {
      return next(new AppError("OTP has expired", 400))
    }
    // Create and save new user
    const newUser = new userSchema({
      name: tempUser.name,
      email: tempUser.email,
      password: tempUser.password,
      avatar: tempUser.avatar
    })
    await newUser.save()

  } catch (error) {}
};
// Log in the user
export const loginUser = (req: Request, res: Response) => {};
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
