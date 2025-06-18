import { Request, Response, NextFunction } from "express";
import tempAuthSchema from "./auth.tempModel";
import authSchema from "./auth.model";
import { AppError } from "../../utils/appError";
import {
  validateSignupUser,
  validateUserLogin,
  validateUserOTP,
} from "./auth.validation";

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
};
