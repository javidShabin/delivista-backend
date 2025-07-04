import { AppError } from "../../utils/appError";
import {
  IupdateUserPassword,
  IuserCreaction,
  IuserLogin,
  IuserOTPverifying,
} from "./auth.interface";

// Validation for user signupn
export const validateSignupUser = (data: IuserCreaction) => {
  // Destructer the user details as data from interface
  const { name, email, password, confirmPassword, phone } = data;
  // Check the required fields are present or not
  if (!name || !email || !password || !confirmPassword || !phone) {
    throw new AppError("All fields are required", 400);
  }
  // Compare the password and conform password
  if (password !== confirmPassword) {
    throw new AppError("Passwords do not match", 400);
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw new AppError("Invalid email format", 400);
  }

  if (password.length < 6) {
    throw new AppError("Password must be at least 6 characters", 400);
  }
};

// Validation for user OTP verification
export const validateUserOTPandEmail = (data: IuserOTPverifying) => {
  // Destructer the user email and otp
  const { email, otp } = data;
  // Check the otp and email is present or not
  if (!email || !otp) {
    throw new AppError("OTP and email is required", 400);
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw new AppError("Invalid email format", 400);
  }
  if (otp.length < 6) {
    throw new AppError("OTP must have 6 number", 400);
  }
};

// Validation for user login
export const validateUserLogin = (data: IuserLogin) => {
  // Destructer the user email and password
  const { email, password } = data;
  // Check the email and password is present
  if (!email || !password) {
    throw new AppError("Email and password is required", 400);
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw new AppError("Invalid email format", 400);
  }

  if (password.length < 6) {
    throw new AppError("Password must be at least 6 characters", 400);
  }
};

// Validation for update user password
export const validateUpdateUserPassword = (data: IupdateUserPassword) => {
  // Destructer the user email, otp, password and confirm password
  const { email, otp, password, confirmPassword } = data;
  // Check the required fields are present or not
  if (!email ||!otp ||!password ||!confirmPassword) {
    throw new AppError("All fields are required", 400);
  }
  // Compare the password and conform password
  if (password!== confirmPassword) {
    throw new AppError("Passwords do not match", 400);
  }
}
