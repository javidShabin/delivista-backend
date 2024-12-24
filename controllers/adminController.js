import { Admin } from "../models/adminModel.js";
import { generateAdminToken } from "../utils/token.js";
import bcrypt from "bcrypt"

// Register admin
const registerAdmin = async (req, res) => {
    try {
      // Extract data from request body
      const { email, password, conformPassword, name, phone } = req.body;
  
      // Basic validation
      if (!email || !password || !conformPassword) {
        return res.status(400).json({ success: false, message: "All fields are required" });
      }
      if (password !== conformPassword) {
        return res.status(400).json({ success: false, message: "Passwords do not match" });
      }
      if (password.length < 8) {
        return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
      }
  
      // Check if the admin already exists
      if (await Admin.exists({ email })) {
        return res.status(409).json({ success: false, message: "Admin already exists" });
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create and save admin
      const newAdmin = await Admin.create({
        email,
        password: hashedPassword,
        name: name || null, // Optional fields
        phone: phone || null,
      });
  
      // Generate token
      const token = generateAdminToken({
        _id: newAdmin._id,
        email: newAdmin.email,
        role: "admin",
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
        message: "Admin created successfully",
      });
    } catch (error) {
      console.error("Error registering admin:", error.message);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  
  export {registerAdmin};