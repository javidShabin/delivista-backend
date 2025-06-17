import { Request, Response, NextFunction } from "express";
import menuSchema from "./menu.model";
import { AppError } from "../../utils/appError";
import { validateMenuCreation } from "./menu.validation";

// Create menu
export const createMenu = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate the details first
    validateMenuCreation(req.body);
    // Destructer data from request body after validation
    const { productName, description, category, price } = req.body;
    // Check the same item already in db
    const isMenuItem = await menuSchema.find({ productName });
    if (isMenuItem) {
      return next(new AppError("The item already exists", 400));
    }
  } catch (error) {}
};
