import { AppError } from "../../utils/appError";
import { IRestaurantCreation } from "./rest.interface";

// Validation for restaurant creating
export const validateRestaurantCreation = (data: IRestaurantCreation) => {
  // Destructer the restaurant details as data from interface
  const { name, seller, phone, address, cuisine } = data;
  // Check the required fields are present or not
  if (!name || !seller || !phone || !address || !cuisine) {
    throw new AppError("All fields are required", 400);
  }

};
