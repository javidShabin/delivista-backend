import cloudinary from "../../configs/cloudinary";
import { AppError } from "../../utils/appError";
import { mailTransporter } from "./../../configs/transportMail";
import bcrypt from "bcrypt";

// Hashes a plain text password with a salt round of 10
export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};

// Compare the user password using bcrypt
export const comparePassword = async (
  password: string,
  userPassword: string
) => {
  return bcrypt.compareSync(password, userPassword);
};

// Sends an OTP email to the specified address
export const sendOtpEmail = async (
  email: string,
  otp: string
): Promise<void> => {
  const mailOptions = {
    from: process.env.EMAIL, // Sender email address from environment variables
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}. It expires in 10 minutes.`,
  };
  await mailTransporter.sendMail(mailOptions); // Send the email using the configured transporter
};

// Handles the avatar upload process using Cloudinary
export const handleAvatarUpload = async (file: any) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(file.path);
    // Store the image url to update user data
    return uploadResult.secure_url;
  } catch (error) {
    throw new AppError("Failed to upload avatar image", 500);
  }
};
