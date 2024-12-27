import { Seller } from "../models/sellerModel";
import bcrypt from "bcrypt";
import { generateSellerToken } from "../utils/token";

// Register seller
const registerSeller = async (req, res) => {
  try {
    // Extract data from request body
    const { email, password, conformPassword, name, phone } = req.body;

    // Basic validation
    if (!email || !password || !conformPassword) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    if (password !== conformPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match" });
    }
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }
    // Check if the seller already exists
    if (await Seller.exists({ email })) {
      return res
        .status(409)
        .json({ success: false, message: "Seller already exists" });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create and save seller
    const newSeller = await Seller.create({
      email,
      password: hashedPassword,
      name: name || null,
      phone: phone || null,
    });

    // Generate token
    const token = generateSellerToken({
      _id: newSeller._id,
      email: newSeller.email,
      role: "seller",
    });
    // Set cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };
    res.cookie("adminToken", token, cookieOptions);

    // Send success response
    res.status(201).json({
      success: true,
      message: "Seller created successfully",
    });
  } catch (error) {
    console.error("Error registering admin:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
// Login the seller
const loginSeller = async (req, res) => {
  try {
  } catch (error) {}
};
// Logout the seller, (clear the cookie)
const logoutSeller = async (req, res) => {
  try {
  } catch (error) {}
};
// Get seller profile
const sellerProfile = async (req, res) => {
  try {
  } catch (error) {}
};
// Update the seller profile include the cloudinery and multer
const updateSellerProfile = async (req, res) => {
  try {
  } catch (error) {}
};
// Change the seller password
const changePassword = async (req, res) => {
  try {
  } catch (error) {}
};
// Check admin autharization
const checkSeller = async (req, res) => {
  try {
  } catch (error) {}
};

export {
  registerSeller,
  loginSeller,
  logoutSeller,
  sellerProfile,
  updateSellerProfile,
  changePassword,
  checkSeller,
};
