import { AppError } from "../../utils/appError";
import { ICartCreation } from "./cart.interface";

// Validation for cart creation
export const validateCartCreation = (data: ICartCreation) => {
    // Destructer the cart details as data from interface
    const { sellerId, customerId, restaurantId, items } = data;
    // Check all fields are present or not
    if (!sellerId ||!customerId ||!restaurantId ||!items ) {
        throw new AppError("All fields are required", 400);
    }
}