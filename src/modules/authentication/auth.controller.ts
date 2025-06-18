import { Request, Response, NextFunction } from "express";
import tempAuthSchema from "./auth.tempModel";
import authSchema from "./auth.model";
import { AppError } from "../../utils/appError";
import {
  validateSignupUser,
  validateUserLogin,
  validateUserOTP,
} from "./auth.validation";
import { generateOTP, hashPassword } from "./auth.service";

// Generate and send OTP to user email
// Send OTP using node mailer to user email
export const singupUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Validate the user details in validate function
  validateSignupUser(req.body);
  // Destructer the details from request body
  const { name, email, password, phone, role } = req.body;
  // Validate the role
  const validRoles = ["admin", "seller", "customer"];
  if (!validRoles.includes(role)) {
    return next(new AppError("Invalid role specified", 400));
  }
// Check if the user is already exist or not
const isUserExist = await authSchema.findOne({email})
if (isUserExist) {
  throw new AppError("User already exists", 400)
}
  // Hash the user password
  const hashedPassword = await hashPassword(password);
  // Generate a random 6-digit OTP
  const otp = generateOTP();

  // Create a temporary user record with the OTP and OTP expiring
  const temUser = await tempAuthSchema.findOneAndUpdate(
    { email },
    {
      name,
      email,
      password: hashedPassword,
      phone,
      otp,
      otpExpires: new Date(Date.now() + 10 * 60 * 1000), // OTP expires in 10 minutes
    }
  );
  
};
