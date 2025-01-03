import { Seller } from "../models/sellerModel.js";
import bcrypt from "bcrypt";
import { generateSellerToken } from "../utils/token.js";

// Register seller
export const registerSeller = async (req, res) => {
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
export const loginSeller = async (req, res) => {
  try {
    // Get values from req.body
    const { name, email, password } = req.body;
    // Check if required fields are present
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    // check the seller with email
    const isSellerExist = await Seller.findOne({ email });
    // If the seller not exists pass respones as error
    if (!isSellerExist) {
      return res
        .status(401)
        .json({ success: false, message: "Seller does not exist" });
    }
    // Check the passowrd match or not
    const passwordMatch = bcrypt.compareSync(password, isSellerExist.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Password incorrect" });
    }
    // Generate token
    const token = generateSellerToken(isSellerExist._id);
    // Pass token as cookie
    res.cookie("sellerToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.status(201).json({ success: true, message: "seller logged in" });
  } catch (error) {
    res.status(404).json({ message: "faild to admin login" });
  }
};
// Logout the seller, (clear the cookie)
export const logoutSeller = async (req, res) => {
  try {
    res.clearCookie("sellerToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    return res
      .status(200)
      .json({ success: true, message: "Seller logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res
      .status(500)
      .json({ success: false, message: "An error occurred during logout" });
  }
};
// Get seller profile
export const sellerProfile = async (req, res) => {
  try {
    // Get seller from request
    const { seller } = req;
    // Fetch seller profile, selecting only necessary field
    const sellerData = await Seller.findById(seller.id).select(
      "image name email phone _id"
    );
    if (!sellerData) {
      return res.status(404).json({ message: "Seller not found" });
    }
    // Send the seller profile details
    res.json({
      success: true,
      message: "Seller profile fetched successfully",
      seller: sellerData,
    });
  } catch (error) {
    console.error("Error fetching seller profile:", error.message);
    res.status(500).json({
      message: "Failed to fetch seller profile. Please try again later.",
    });
  }
};
// Update the seller profile include the cloudinery and multer
export const updateSellerProfile = async (req, res) => {
  try {
  } catch (error) {}
};
// Change the seller password
export const changePassword = async (req, res) => {
  try {
  } catch (error) {}
};
// Check admin autharization
export const checkSeller = async (req, res) => {
  try {
  } catch (error) {}
};
