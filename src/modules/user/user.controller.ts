import { Request, Response, NextFunction } from "express";
import userSchema from "../authentication/auth.model";

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

    const skip = (page - 1) * limit;

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
