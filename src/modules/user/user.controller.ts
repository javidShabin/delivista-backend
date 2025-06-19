import { Request, Response, NextFunction } from "express";
import userSchema from "../authentication/auth.model";

// Get all customers list for admin and seller
export const getAllCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get all list from user filter by role name(customer)
    // Get the list without password
    const customers = await userSchema
      .find({ role: "customer" })
      .select("-password");
    // Sent the list as a responce
    res.status(200).json({
      success: true,
      count: customers.length,
      customers,
    });
  } catch (error) {
    next(error);
  }
};
