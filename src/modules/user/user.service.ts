import { mailTransporter } from "./../../configs/transportMail";
import bcrypt from "bcrypt";

export const hashPassword = async (password: string) => {
    return bcrypt.hash(password, 10)
}

export const sendOtpEmail = async (
  email: string,
  otp: string
): Promise<void> => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}. It expires in 10 minutes.`,
  };
  await mailTransporter.sendMail(mailOptions);
};
