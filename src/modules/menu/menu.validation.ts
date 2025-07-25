import { AppError } from "../../utils/appError";
import { IMenuCreation } from "./menu.interface";

// Validation for menu creation
export const validateMenuCreation = (data: IMenuCreation) => {
  // Destructer menu creation date from interface
  const { productName, description, category, price, sellerId, restaurantId, customerId } = data;
  // Chexk the required fields are present or not
  if (!productName || !description || !category || !price || !sellerId || !restaurantId || !customerId) {
    throw new AppError("All fields are required", 400);
  }
};
