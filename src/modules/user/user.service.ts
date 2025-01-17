import { mailTransporter } from "./../../configs/transportMail";
import bcrypt from "bcrypt";

// Hashes a plain text password with a salt round of 10
export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};

// Compare the user password using bcrypt
export const comparePassword = async (password: string, userPassword: string) => {
  return bcrypt.compareSync(password, userPassword)
}

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
