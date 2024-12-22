import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { TempUser } from "../models/tempUserModel.js";

const userRegistration = async (req, res) => {
  try {
    const { email, password, conformPassword, name, phone, ...rest } = req.body;

    // Validate required fields
    if (!email || !password || !conformPassword || !name || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Password matching validation
    if (password !== conformPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if user already exists in the database
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Generate OTP (6 digits)
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Set up email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // OTP email configuration
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Your OTP for Registration",
      text: `Your OTP is ${otp}. Please verify to complete your registration.`,
    };

    // Send OTP via email
    await transporter.sendMail(mailOptions);

    // Hash password before storing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Store temporary user data with OTP and expiration
    await TempUser.findOneAndUpdate(
      { email },
      {
        email,
        password: hashedPassword,
        otp,
        otpExpiresAt: Date.now() + 10 * 60 * 1000, // OTP expires in 10 minutes
        name,
        phone,
      },
      { upsert: true, new: true }
    );

    // Success response
    res.status(200).json({
      success: true,
      message: "OTP sent to your email. Please verify within 10 minutes.",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
};

export default userRegistration;
