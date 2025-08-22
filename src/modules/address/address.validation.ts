import { AppError } from "../../utils/appError";
import { IAddressCreation } from "./address.interface";

// Validation for address creation
export const validateAddress = (data: IAddressCreation) => {
    // Destructer the address details from the data
    const { fullName, phoneNumber, address, city, state, pincode, addressType } = data
    // Check all fields are present or not
    if (!fullName || !phoneNumber || !address || !city || !state || !pincode || !addressType) {
        throw new AppError("All fields are required", 400);
    }

}