import { Admin } from "../models/adminModel.js";
import { generateAdminToken } from "../utils/token.js";
import bcrypt from "bcrypt";

// Register admin
const registerAdmin = async (req, res) => {
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

    // Check if the admin already exists
    if (await Admin.exists({ email })) {
      return res
        .status(409)
        .json({ success: false, message: "Admin already exists" });
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
// Login the admin
const loginAdmin = async (req, res) => {
  try {
    // Get values from req.body
    const { name, email, password } = req.body;
    // Check if required field are present
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    // Find the admin with email
    const isAdminExist = await Admin.findOne({ email });
    // Check the admin exist or not in database
    if (!isAdminExist) {
      return res
        .status(401)
        .json({ success: false, message: "Admin does not exist" });
    }
    // Check the password match or not
    const passwordMatch = bcrypt.compareSync(password, isAdminExist.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Password incorrect" });
    } // Generate token
    const token = generateAdminToken(isAdminExist._id);
    // Pass token as cookie the token will expire in one hour
    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.status(201).json({ success: true, message: "Admin logged in" });
  } catch (error) {
    res.status(404).json({ message: "faild to admin login" });
  }
};
// Get admin profile
const adminProfile = async (req, res) => {
  try {
    // Get admin from request
    const { admin } = req;
    // Fetch admin profile, selecting only necessary field
    const adminData = await Admin.findById(admin.id).select(
        "image name email phone _id"
      );
      if (!adminData) {
          return res.status(404).json({ message: "Admin not found" });
      }
      // Send the user profile details
      res.json({
          success: true,
          message: "Admin profile fetched successfully",
          admin: adminData, // Send admin data in a more structured format
        });
  } catch (error) {
    console.error("Error fetching admin profile:", error.message);
    res.status(500).json({
      message: "Failed to fetch admin profile. Please try again later.",
    });
  }
};

export { registerAdmin, loginAdmin, adminProfile };
