import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { TempUser } from "../models/tempUserModel.js";
import { User } from "../models/userModel.js";
import { generateUserToken } from "../utils/token.js";
import { cloudinaryInstance } from "../config/cloudinaryConfig.js";

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
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Fetch user with only necessary fields
    const user = await User.findOne({ email }).select("password _id");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate password asynchronously
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a secure token
    const token = generateUserToken(user._id);

    // Configure and set secure cookie
    res.cookie("userToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      sameSite: "none", // Prevent CSRF attacks
      maxAge: 3600000, // 1 hour
    });

    // Respond with success
    res.status(200).json({ success: true, message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Get all user list from database
const getAllUsers = async (req, res) => {
  try {
    // Fetch all users with only necessary fields to optimize performance
    const users = await User.find().select("_id name email phone image");

    if (users.length === 0) {
      return res.status(404).json({ message: "Users not available" });
    }

    // Respond with the list of users
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res
      .status(500)
      .json({ message: "Failed to fetch users. Please try again later." });
  }
};
// Logout user clear tocken from cookie
const userLogout = async (req, res) => {
  try {
    res.clearCookie("userToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    return res
      .status(200)
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res
      .status(500)
      .json({ success: false, message: "An error occurred during logout" });
  }
};
// Get user profile using user id
const userProfile = async (req, res) => {
  try {
    const { user } = req;

    // Fetch user profile, selecting only necessary fields
    const userData = await User.findById(user.id).select(
      "image name email phone _id"
    );

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send the user profile details
    res.json({
      success: true,
      message: "User profile fetched successfully",
      user: userData, // Send user data in a more structured format
    });
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    res.status(500).json({
      message: "Failed to fetch user profile. Please try again later.",
    });
  }
};
// Uodate the user proile
const updateUserProfile = async (req, res) => {
  try {
    // Get user from request
    const { user } = req;

    // Get data from req.body
    const { name, email, phone } = req.body;

    // Store update in a variable
    const updateData = { name, email, phone };

    // Declare a variable
    let uploadResult;

    // Add image file and update the image
    if (req.file) {
      try {
        uploadResult = await cloudinaryInstance.uploader.upload(req.file.path);

        // Assign the uploaded image URL to the user's image field
        updateData.image = uploadResult.secure_url;
      } catch (uploadError) {
        return res.status(500).json({
          success: false,
          message: "File upload failed",
          error: uploadError.message,
        });
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(user.id, updateData, {
      new: true,
    });

    // Check if the user was updated
    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Send response
    res.json({
      success: true,
      message: "User profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};
// Forget password
const ChangePassword = async (req, res) => {
  try {
    // Get data from req.body
    const { email, password } = req.body;

    // Check if the fields are provided
    if (!email || !password) {
      return res.status(400).json({ message: "Fields are required" });
    }

    // Use findOneAndUpdate for efficiency (avoids an extra query)
    const hashedPassword = await bcrypt.hash(password, 12); // Use a stronger salt

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true, runValidators: true } // Ensure the update is validated
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Password has been updated successfully",
    });
  } catch (error) {
    console.error("Error while updating password:", error); // Log full error for debugging
    return res.status(500).json({
      message: "Error while updating password",
      error: error.message,
    });
  }
};

// Forgot password - send OTP
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
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
      subject: "Your OTP for Password Reset",
      text: `Your OTP is ${otp}. Please verify to reset your password.`,
    };

    await transporter.sendMail(mailOptions);

    // Store OTP temporarily
    const otpExpiresAt = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
    await TempUser.findOneAndUpdate(
      { email },
      { otp, otpExpiresAt },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email. Please verify within 10 minutes.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      message: "Failed to send OTP. Please try again later.",
      error: error.message,
    });
  }
};
// Verify OTP and reset password
const verifyOtpAndResetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  // Check if fields are missing
  if (!email || !otp || !newPassword) {
    return res
      .status(400)
      .json({ message: "Email, OTP, and new password are required" });
  }

  try {
    // Find the temporary user by email
    const tempUser = await TempUser.findOne({ email });

    // Check if user doesn't exist or OTP is invalid
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

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10); // Default salt rounds

    // Update user's password
    const user = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    // Remove the temporary OTP entry
    await TempUser.deleteOne({ email });

    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      message: "Failed to reset password. Please try again later.",
      error: error.message,
    });
  }
};
// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure the user ID is valid before querying the database
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Use findByIdAndDelete to efficiently delete the user
    const deletedUser = await User.findByIdAndDelete(id);

    // Check if the user exists before deletion
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error); // Detailed error logging
    return res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
};

// Check user authorization
const checkUser = async (req, res) => {
  try {
    const user = req.user; // Assume user is set from a previous auth middleware

    // Check if the user is authorized or not
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not authorized" });
    }

    // If user is authorized
    return res.status(200).json({ success: true, message: "User authorized" });
  } catch (error) {
    console.error("Error checking user:", error); // Detailed error logging
    return res.status(500).json({
      success: false,
      message: "Error checking user authorization",
      error: error.message,
    });
  }
};

// Export the functions correctly
export {
  userRegistration,
  verifyOtpAndCreateUser,
  userLogin,
  getAllUsers,
  userLogout,
  userProfile,
  updateUserProfile,
  ChangePassword,
  forgotPassword,
  verifyOtpAndResetPassword,
  deleteUser,
  checkUser,
};
