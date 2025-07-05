import { Request, Response, NextFunction } from "express";
import userSchema from "../authentication/auth.model";
import { AppError } from "../../utils/appError";
import { handleImageUpload } from "../../shared/cloudinary/upload.file";

// Get all customers list for admin and seller
export const getAllCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract pagination and search query
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";

    const skip = (page - 1) * limit; // Calculate how many documents to skip for pagination

    // Build filter condition
    const filter = {
      role: "customer",
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };

    // Fetch total count for pagination
    const totalCustomers = await userSchema.countDocuments(filter);

    // Fetch filtered and paginated customers without passwords
    const customers = await userSchema
      .find(filter)
      .select("-password")
      .skip(skip)
      .limit(limit);

    // Send the list with pagination info
    res.status(200).json({
      success: true,
      count: customers.length,
      totalPages: Math.ceil(totalCustomers / limit),
      currentPage: page,
      totalCustomers,
      customers,
    });
  } catch (error) {
    next(error);
  }
};

// Get customer profile using id from user authentication
export const getCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get customer id from user authentication
    const userId = req.user?.id;
    if (!userId) {
      return next(new AppError("Unauthorized", 401));
    }
    // Find the user by id and also check role is customer
    const customer = await userSchema
      .findOne({ _id: userId, role: "customer" })
      .select("-password");
    // Check the user is present or not
    if (!customer) {
      throw new AppError("Customer not found", 404);
    }
    // Id have to find any user return as a response
    res.status(200).json({
      success: true,
      customer,
    });
  } catch (error) {
    next(error);
  }
};

// Update customer profile using id from authentication
export const updateCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get customer id from user authentication
    const userId = req.user?.id;
    if (!userId) {
      return next(new AppError("Unauthorized", 401));
    }
    // Extract update fields from request body
    const { name, email, phone, avatar } = req.body;
    // Prepare the update data
    const updatedData: any = {
      name,
      email,
      phone,
      avatar,
    };
    // If file is provided, upload it to cloudinary
    if (req.file) {
      const userProfileImage = await handleImageUpload(req.file);
      updatedData.avatar = userProfileImage;
    }
    // Update the customer profile
    const updatedUser = await userSchema.findByIdAndUpdate(
      userId,
      { $set: updatedData },
      { new: true }
    );
    if (!updatedUser) {
      return next(new AppError("User not found", 404));
    }
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};
