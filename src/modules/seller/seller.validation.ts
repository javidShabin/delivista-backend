import { AppError } from "../../utils/appError";
import {
  IsellerCreation,
  IsellerLogin,
  IsellerOTPverifying,
} from "./seller.interface";

// Validation for seller signup
export const validateSignupSeller = (data: IsellerCreation) => {
  // Destructer the seller details as data from interface
  const { name, email, password, confirmPassword, phone } = data;
  // Check the required fields are present or not
  if (!name || !email || !password || !confirmPassword || !phone) {
    throw new AppError("All fields are required", 400);
  }
  // Compare the password and conform password
  if (password !== confirmPassword) {
    throw new AppError("Passwords do not match", 400);
  }
  // Validate email format
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw new AppError("Invalid email format", 400);
  }
  // Validate password length
  if (password.length < 6) {
    throw new AppError("Password must be at least 6 characters", 400);
  }
};

// Validation for seller OTP verification
export const validateSellerOTP = (data: IsellerOTPverifying) => {
  // Destructer the seller email and otp
  const { email, otp } = data;
  // Check the otp and email is present or not
  if (!email || !otp) {
    throw new AppError("OTP and email is required", 400);
  }
  // Validate email format
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw new AppError("Invalid email format", 400);
  }
};

// Validation for seller login
export const validateSellerLogin = (data: IsellerLogin) => {
  // Destructer the seller email and password
  const { email, password } = data;
  // Check the email and password is present
  if (!email || !password) {
    throw new AppError("Email and password is required", 400);
  }
  // Validate email format
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw new AppError("Invalid email format", 400);
  }
  // Validate password length
  if (password.length < 6) {
    throw new AppError("Password must be at least 6 characters", 400);
  }
};
