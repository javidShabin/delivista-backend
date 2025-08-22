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

// Update address (without editing isDefault)
export const updateAddress = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Get the user id from authentication
        const customerId = req.user?.id;
        const addressId = req.params.addressId; // Get the address id from parameter

        // Check the user id is present or not
        if (!customerId) {
            return next(new AppError("Unauthorized: customerId missing", 401));
        }

        // Destructure allowed fields
        const {
            fullName,
            phoneNumber,
            address,
            city,
            state,
            pincode,
            addressType,
        } = req.body;

        // Prepare update object (no isDefault here)
        const updateFields = {
            fullName,
            phoneNumber,
            address,
            city,
            state,
            pincode,
            addressType,
        };

        // find and update the address
        const updatedAddress = await addressSchema.findOneAndUpdate(
            { _id: addressId, customerId },
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if (!updatedAddress) {
            return next(new AppError("Address not found or not authorized", 404));
        }

        res.status(200).json({ // Send response
            success: true,
            message: "Address updated successfully",
            data: updatedAddress,
        });
    } catch (error) {
        next(error);
    }
};

// Delete address
export const deleteAddress = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const customerId = req.user?.id;
        const addressId = req.params.addressId;

        if (!customerId) {
            return next(new AppError("Unauthorized: customerId missing", 401));
        }

        const deletedAddress = await addressSchema.findOneAndDelete({
            _id: addressId,
            customerId,
        });

        if (!deletedAddress) {
            return next(new AppError("Address not found or not authorized", 404));
        }

        res.status(200).json({
            success: true,
            message: "Address deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

// ***************** Update default and get all address ********************
// Set address as default
export const setDefaultAddress = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const customerId = req.user?.id;
        const addressId = req.params.addressId;

        if (!customerId) {
            return next(new AppError("Unauthorized: customerId missing", 401));
        }

        // First reset all to false
        await addressSchema.updateMany(
            { customerId },
            { $set: { isDefault: false } }
        );

        // Then set this one to true
        const updated = await addressSchema.findOneAndUpdate(
            { _id: addressId, customerId },
            { $set: { isDefault: true } },
            { new: true }
        );

        if (!updated) {
            return next(new AppError("Address not found or not authorized", 404));
        }

        res.status(200).json({
            success: true,
            message: "Default address updated successfully",
            data: updated,
        });
    } catch (error) {
        next(error);
    }
};
