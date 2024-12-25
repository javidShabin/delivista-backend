
import { cloudinaryInstance } from "../config/cloudinaryConfig.js";
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
const adminLogout = async (req, res) => {
  try {
    res.clearCookie("adminToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    return res
      .status(200)
      .json({ success: true, message: "Admin logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res
      .status(500)
      .json({ success: false, message: "An error occurred during logout" });
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
// Update the admin profile include the cloudinery and multer
const updateAdminProfile = async (req, res) => {
  try {
    // Get admin from request
    const { admin } = req;
    // Get updated data from request body
    const { name, email, phone } = req.body;
    // Store update in a variable
    const updatedDate = { name, email, phone };

    // Declare a variable
    let uploadResult;

    // Add image file and update the image
    if (req.file) {
      try {
        uploadResult = await cloudinaryInstance.uploader.upload(req.file.path);

        // Assign the uploaded image URL to the user's image field
        updatedDate.image = uploadResult.secure_url;
      } catch (uploadError) {
        return res.status(500).json({
          success: false,
          message: "File upload failed",
          error: uploadError.message,
        });
      }
    }
    // Update admin
    const updatedAdmin = await Admin.findByIdAndUpdate(admin.id, updatedDate, {
      new: true,
    });
    // Check if the user was updated
    if (!updatedAdmin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }
    // Send response
    res.json({
      success: true,
      message: "User profile updated successfully",
      data: updatedAdmin,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};
// Change password for admin
const changePassword = async (req, res) => {
  try {
    // Get data from req.body
    const { email, password } = req.body;
    // Check if the required fields are provided
    if (!email || !password) {
      return res.status(400).json({ message: "Fielda are required" });
    }

    // Hash the new password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 12);
    // Use findOneAndUpdate for efficiency
    const updatedAdmin = await Admin.findByIdAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true, runValidators: true } // Ensure the update is validate
    );

    // Check hade the updated admin
    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
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

export {
  registerAdmin,
  loginAdmin,
  adminLogout,
  adminProfile,
  updateAdminProfile,
  changePassword,
};
