import { Request, Response, NextFunction } from "express";
import tempUserSchema from "./user.tempModel";
import userSchema from "./user.model";
import { comparePassword, hashPassword, sendOtpEmail } from "./user.service";
import { AppError } from "../../utils/appError";
import {
  validateSignupUser,
  validateUserLogin,
  validateUserOTP,
  validateUserPassword,
} from "./user.validation";
import { generateToken } from "../../utils/generateToken";
import cloudinary from "../../configs/cloudinary";

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
    res.status(200).json({ status: "success", message: "OTP sent to email" });
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

    // Respond with success response
    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Log in the user
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate the user login details
    validateUserLogin(req.body);
    // Get the email and password from req.body
    const { email, password } = req.body;
    // Check the user is exist
    const isUserExist = await userSchema.findOne({ email });
    if (!isUserExist) {
      return next(new AppError("User does not exist", 401));
    }
    // Compare the user password
    const isPasswordCorrect = await comparePassword(
      password,
      isUserExist.password
    );
    if (!isPasswordCorrect) {
      return next(new AppError("Invalid credentials", 401));
    }
    // Generate a token for the user
    const token = generateToken({
      id: isUserExist._id.toString(),
      email: isUserExist.email,
      role: isUserExist.role,
    });
    // Set the user token to cookie
    res.cookie("userToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    res.status(201).json({
      success: true,
      message: "User logged in successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get users list
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get all user from the database
    const user = await userSchema.find({}).select("-password");
    // Check if there are any user
    if (!user) {
      return next(new AppError("No useres found", 401));
    }
    // Return the users
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

// Get user profile using user ID
export const getUserProfileById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    // Find the user by Id from database
    const userProfile = await userSchema.findById(userId).select("-password");
    // Check if the user exists
    if (!userProfile) {
      return next(new AppError("User not found", 404));
    }
    // Return the user profile
    res.status(200).json({ userProfile });
  } catch (error) {
    next(error);
  }
};

// Update user profile by user ID
export const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get user Id form req.user
    const id = req.user?.id;
    // Check user Id present or not
    if (!id) {
      return next(new AppError("Unauthorized access", 401));
    }

    // Extract updated fields from request body
    const { name, email, phone, avatar } = req.body;
    // Prepare the update date
    const updateUserData = {
      name,
      email,
      phone,
      avatar,
    };

    // If file is provide from request body, upload it to Cloudinary
    if (req.file) {
      try {
        const uploadResult = await cloudinary.uploader.upload(req.file.path);
        // Store the image url to update user data
        updateUserData.avatar = uploadResult.secure_url;
      } catch (uploadError: any) {
        return next(
          new AppError("File upload failed" + uploadError.message, 500)
        );
      }
    }

    // Update user data in the database
    const updatedUser = await userSchema.findByIdAndUpdate(id, updateUserData, {
      new: true,
    });
    // Handle case when user is not found
    if (!updatedUser) {
      return next(new AppError("User not found", 404));
    }
    // Send the updated user as a response
    res.json({
      success: true,
      message: "Your profile updated successfully",
      updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// Forgot password OTP generation
export const generateFogotPassOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Destructer email from request body
    const { email } = req.body;
    // Check email present or not
    if (!email) {
      return next(new AppError("Email is required", 400));
    }
    // Find the user by email Id
    const isUser = await userSchema.findOne({ email });
    if (!isUser) {
      return next(new AppError("User not found", 404));
    }

    // Generate 6-digit OTP for password reset
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await tempUserSchema.findOneAndUpdate(
      { email },
      {
        otp,
        otpExpires: Date.now() + 10 * 60 * 1000,
      },
      { upsert: true, new: true }
    );
    // Set up email message details
    await sendOtpEmail(email, otp);
    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    next(error);
  }
};

// Verify the OTP and resent password
export const verifyForgotPasswordOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateUserOTP(req.body);
    // Destructer the emial and otp from request body
    const { email, otp } = req.body;
    // Find the temp user using email, and check the user is present
    const tempUser = await tempUserSchema.findOne({ email });
    if (!tempUser) {
      return next(new AppError("User not found", 404));
    }
    //Compare the OTP
    if (tempUser.otp !== otp) {
      return next(new AppError("Invalid OTP", 400));
    }
    // OTP is valid
    res.status(200).json({
      message: "OTP verified successfully. You can now change your password.",
    });
  } catch (error) {
    next(error);
  }
};

// Update the user password
export const updateUserPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateUserPassword(req.body);
    // Destructer the email, password and verify password
    const { email, password } = req.body;
    // Find the tempUser using email
    const isTempUser = tempUserSchema.findOne({ email });
    if (!isTempUser) {
      return next(new AppError("User not found", 404));
    }
    // Hash the users new password
    const hashedPassword = await hashPassword(password);
    // Upda the the new password
    const user = await userSchema.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );
    // Clear the tempUser
    await tempUserSchema.deleteOne({ email });
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
};

// Log out user
export const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Clear the token from cookie
    res.clearCookie("userToken", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    next(error);
  }
};

// Check user controller
export const checkUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const isUser = req.user;
    if (!isUser) {
      return next(new AppError("User not autherised", 401));
    }
    res.json({ success: true, message: "user autherised" });
  } catch (error) {
    next(error);
  }
};
