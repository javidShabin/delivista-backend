import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { TempUser } from "../models/tempUserModel.js";
import { User } from "../models/userModel.js";
import { generateUserToken } from "../utils/token.js";

// User registration
const userRegistration = async (req, res) => {
  const { email, password, conformPassword, name, phone, ...rest } = req.body;

  // Validate required fields
  if (![email, password, conformPassword, name, phone].every(Boolean)) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Password matching validation
  if (password !== conformPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    // Check if user already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Generate OTP (6 digits)
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Set up email transporter and send OTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Your OTP for Registration",
      text: `Your OTP is ${otp}. Please verify to complete your registration.`,
    };

    await transporter.sendMail(mailOptions);

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10); // Default saltRounds = 10

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
    return res.status(200).json({
      success: true,
      message: "OTP sent to your email. Please verify within 10 minutes.",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
};
// Verify the otp
const verifyOtpAndCreateUser = async (req, res) => {
  const { email, otp } = req.body;

  // Check if required fields are missing
  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  try {
    // Find the temporary user by email
    const tempUser = await TempUser.findOne({ email });

    // Check if user doesn't exist
    if (!tempUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if OTP is invalid or expired
    if (tempUser.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (tempUser.otpExpiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Create the actual user
    const newUser = new User({
      name: tempUser.name,
      phone: tempUser.phone,
      email: tempUser.email,
      password: tempUser.password,
    });

    // Save new user to the database
    await newUser.save();

    // Generate the user token
    const token = generateUserToken({
      _id: newUser._id,
      email: newUser.email,
      role: "user",
    });

    // Set the token as a secure cookie
    res.cookie("userToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Ensure cookie is secure only in production
      sameSite: "None", // Ensure cross-site cookie is handled properly
    });

    // Remove the temporary user from the database after successful registration
    await TempUser.deleteOne({ email });

    // Send success response
    return res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("OTP verification error:", error); // Improved logging for debugging
    return res.status(500).json({
      message: "OTP verification failed",
      error: error.message,
    });
  }
};
// Login function for user
const userLogin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find the user by email and fetch only the necessary fields
    const user = await User.findOne({ email }).select("password _id");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Compare the password asynchronously
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    // Generate a secure token
    const token = generateUserToken(user._id);

    // Set token as a secure, HTTP-only cookie
    res.cookie("userToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 3600000, // 1 hour in milliseconds
    });

    // Send success response
    res.status(200).json({ success: true, message: "User logged in" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Failed to login user" });
  }
};

// Export the functions correctly
export { userRegistration, verifyOtpAndCreateUser, userLogin };
