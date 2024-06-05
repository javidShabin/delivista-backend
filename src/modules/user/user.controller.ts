import { Request, Response, NextFunction } from "express";
import tempUserSchema from "./user.tempModel"
import userSchema from "./user.model"
import { IuserCreaction } from "./user.interface";
import {hashPassword, sendOtpEmail} from "./user.service"
import { AppError } from "../../utils/appError";


// Generate and send OTP to user email
export const signupUser = (req: Request, res: Response, next: NextFunction) => {
    // Destructer the user details from request body
   const { name, email, password, confirmPassword, phone }: IuserCreaction = req.body;
   // Check the required fields are present or not
   if (!name || !email || !password || !confirmPassword || !phone) {
    return next(new AppError("All fields are required", 400));
   }
};
// Verify the OTP and create a new user
export const verifyOtpAndCreateUser = (req: Request, res: Response) => {};
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
