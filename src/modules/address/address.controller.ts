import { Request, Response, NextFunction } from "express";
import addressSchema from "./address.model"
import { AppError } from "../../utils/appError";
import { validateAddress } from "./address.validation";

// ********************* Address CRUD Operation **********************
// Create address
export const createAddress = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const customerId = req.user?.id; // assuming user is stored in req.user after auth middleware
        if (!customerId) {
            return next(new AppError("Unauthorized: customerId missing", 401));
        }

        // Validate request body
        validateAddress(req.body);

        const { fullName, phoneNumber, address, city, state, pincode, addressType, isDefault } = req.body;

        // If isDefault is true, set all previous addresses isDefault = false
        if (isDefault) {
            await addressSchema.updateMany(
                { customerId },
                { $set: { isDefault: false } }
            );
        }

        // Create new address
        const newAddress = await addressSchema.create({
            customerId,
            fullName,
            phoneNumber,
            address,
            city,
            state,
            pincode,
            addressType,
            isDefault: isDefault || false,
        });

        res.status(201).json({
            success: true,
            message: "Address created successfully",
            data: newAddress,
        });
    } catch (error) {
        next(error);
    }
};