import { mailTransporter } from "../../configs/transportMail";

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
