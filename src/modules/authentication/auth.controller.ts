import { Request, Response, NextFunction } from "express";
import tempAuthSchema from "./auth.tempModel";
import authSchema from "./auth.model";
import { AppError } from "../../utils/appError";
import {
  validateSignupUser,
  validateUserLogin,
  validateUserOTPandEmail,
} from "./auth.validation";
import { comparePassword, generateOTP, hashPassword } from "./auth.service";
import { sendOtpEmail } from "../../shared/email/send.mail";
import { generateToken } from "../../utils/generateToken";

// Generate and send OTP to user email
// Send OTP using node mailer to user email
export const singupUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
    const isUserExist = await authSchema.findOne({ email });
    if (isUserExist) {
      throw new AppError("User already exists", 400);
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
      },
      { upsert: true, new: true }
    );
    // Send the OTP to the user's emial
    await sendOtpEmail(email, otp);
    let user = tempAuthSchema.find({ email });
    // Respond with a success message
    res.status(200).json({
      status: "success",
      message: "OTP sent to your email. Please verify to complete signup.",
    });
  } catch (error) {
    next(error);
  }
};

// verify the user OTP and create new user
export const verifyOtpandCreateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate OTP and email
    validateUserOTPandEmail(req.body);
    // Destructer OTP and email from request body
    const { otp, email } = req.body;
    console.log(otp);

    // Check if the user exists as a temporary user
    const tempUser = await tempAuthSchema.findOne({ email });
    if (!tempUser) {
      throw new AppError("User not found", 400);
    }

    // Compare the OTP with tmepuser OTP
    if (tempUser.otp !== otp) {
      throw new AppError("Invalid OTP", 400);
    }
    // Check the OTP is expire or not
    if (tempUser.otpExpires.getTime() < Date.now()) {
      throw new AppError("OTP has expired", 400);
    }
    // Create the new user and save database
    const newUser = new authSchema({
      name: tempUser.name,
      email: tempUser.email,
      password: tempUser.password,
      phone: tempUser.phone,
      role: tempUser.role,
      avatar: tempUser.avatar,
    });
    await newUser.save();
    //Token creation
    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });
    res.cookie("userToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    await tempAuthSchema.deleteOne({ email });
    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Login user , compare hashed password
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate the user details
    validateUserLogin(req.body);
    // Destructer email and password
    const { email, password } = req.body;
    // FInd the user by email
    const isUser = await authSchema.findOne({ email });
    if (!isUser) {
      throw new AppError("User does not exist with this email", 400);
    }
    // Compare password
    const isMatch = await comparePassword(password, isUser.password);

    // If password does not match, throw an error
    if (!isMatch) {
      throw new AppError("Invalid password", 401);
    }

    // Token creation
    const token = generateToken({
      id: isUser.id,
      email: isUser.email,
      role: isUser.role,
    });
    // Send the token to cookie
    res.cookie("userToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    res.status(200).json({ message: "User logged in successfully" });
  } catch (error) {
    next(error);
  }
};
