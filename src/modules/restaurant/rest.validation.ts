import { AppError } from "../../utils/appError";
import { IRestaurantCreation } from "./rest.interface";

// Validation for restaurant creation
export const validateRestaurantCreation = (data: IRestaurantCreation, file?: Express.Multer.File) => {
  // Destructer all fileds from data
  const { name, phone, address, cuisine } = data;

  // Check all fields are present or not
  if (!name || !phone || !address || !cuisine) {
    throw new AppError("All fields are required", 400);
  }

  if (!file) {
    throw new AppError("Image file is required", 400);
  }

};
