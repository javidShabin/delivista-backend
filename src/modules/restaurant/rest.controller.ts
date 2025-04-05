import { Request, Response, NextFunction } from "express";
import restSchema from "./rest.model";
import { handleImageUpload } from "./rest.service";
import { AppError } from "../../utils/appError";
import { validateRestaurantCreation } from "./rest.validation";


// Create restaurant
export const createRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get seller Id from seller authentication
    const sellerId = req.user?.id;
    if (!sellerId) {
      throw next(new AppError("Unauthorised access", 404));
    }
    // Validate first restaurant datials
    validateRestaurantCreation(req.body, req.file);
    // Destructer all fields from request body
    const { name, phone, address, cuisine, image, pinCode } = req.body;
    // Check have any restaurant with same name
    const existRestaurant = await restSchema.findOne({ name });
    if (existRestaurant) {
      throw next(new AppError("Restaurant already exist with same name", 404));
    }

    let uploadImage;

    // If an image file is uploaded
    if (req.file) {
      // Handle the image upload and get the file path
      uploadImage = await handleImageUpload(req.file);
    }
    // Save restaurant data to database
    const restaurant = new restSchema({
      name,
      phone,
      address,
      cuisine,
      pinCode,
      image: uploadImage,
      sellerId,
    });
    const saveRestaurant = await restaurant.save();
    res.status(201).json(saveRestaurant);
  } catch (error) {
    next(error);
  }
};

// Get all restaurants
export const getAllRestaurants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Find the all restaurants
    const restaurants = await restSchema.find({});
    // If not have any restaurants return a error
    if (restaurants.length === 0) {
      throw next(new AppError("Not found restaurants", 404));
    }
    res.status(200).json({
      success: true,
      message: "Find the resuataurants",
      restaurants,
    });
  } catch (error) {
    next(error);
  }
};

// Get verified restaurants
export const getVerifiedRestaurants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get admin verifyed restaurant list for customers and admin
    const verifiedRestaurants = await restSchema.find({ isVerified: true });
    // If not haver any verified restaurants
    if (verifiedRestaurants.length === 0) {
      throw next(new AppError("Not have any verified restaurants", 404));
    }

    res.status(200).json({
      success: true,
      message: "Admin verified restaurants",
      verifiedRestaurants,
    });
  } catch (error) {
    next(error);
  }
};

// Verification restaurant for admin
export const adminVerifyingRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get restaurant id from request params
    const restaurantId = req.params?.restaurantId;
    // Check the restuarant id present or not
    if (!restaurantId) {
      return next(new AppError("Restaurant id is required", 404));
    }
    // Find restaurant by id
    const isRestaurant = await restSchema.findById(restaurantId);
    // Check the restaurant is present
    if (!isRestaurant) {
      return next(new AppError("Restaurant not found", 404));
    }

    // Update the verification restaurant
    isRestaurant.isVerified = true;
    await isRestaurant.save(); // Save that in database
    // Send restaurant as a response
    res.status(200).json({
      success: true,
      message: "Restaurant verified successfully",
      data: isRestaurant,
    });
  } catch (error) {
    next(error);
  }
};

// Get restaurant by ID
export const getRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get restaurant id from request params
    const restaurantId = req.params?.restaurantId;
    // Check the restuarant id present or not
    if (!restaurantId) {
      return next(new AppError("Restaurant id is required", 404));
    }
    // Find restaurant by id
    const isRestaurant = await restSchema.findById(restaurantId);
    // Check the restaurant is present
    if (!isRestaurant) {
      return next(new AppError("Restaurant not found", 404));
    }
    // Send the restaurant details as a response
    res.status(200).json(isRestaurant);
  } catch (error) {
    next(error);
  }
};

// Get restarant by seller ID for seller
export const getRestaurantBySeller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get seller Id from seller authentication
    const sellerId = req.user?.id;
    // Find the restaurant by seller id
    const isRestaurant = await restSchema.findOne({ sellerId });
    // If not have any restaurant under the seller return a error
    if (!isRestaurant) {
      throw next(new AppError("Restaurant not found", 404));
    }
    // Send as a response
    res.status(200).json(isRestaurant);
  } catch (error) {
    next(error);
  }
};

// Filter restaurant by menu
// export const getRestaurantByMenu = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {};

// Toggle restaurant status for seller (open or close)
export const toggleRestaurantStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get seller from seller authentication
    const sellerId = req.user?.id;
    // Find the restaurant by seller id
    const isRestaurant = await restSchema.findOne({ sellerId });
    // If not get restaurant with same seller id return error
    if (!isRestaurant) {
      throw next(new AppError("Restaurant not found", 404));
    }
    // The toggled restaurant open and close
    // Toggle open/close status
    isRestaurant.isOpen = !isRestaurant.isOpen;
    // Save the updated status
    await isRestaurant.save();
    // Send response
    res.status(200).json({
      success: true,
      message: `Restaurant is now ${isRestaurant.isOpen ? "Open" : "Closed"}`,
      data: { isOpen: isRestaurant.isOpen },
    });
  } catch (error) {
    next(error);
  }
};

// Update restaurant
export const updateRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { restaurantId } = req.params;

    if (!restaurantId) {
      return next(new AppError("Restaurant ID is required", 400));
    }

    // Extract updated fields from request body
    const {
      name,
      phone,
      address,
      cuisine,
      pinCode,
      image,
      openTime,
      closeTime,
    } = req.body;

    // Prepare update object
    const updateData: any = {
      name,
      phone,
      address,
      cuisine,
      pinCode,
      image,
      openTime,
      closeTime,
    };

    // If image file is uploaded, handle it
    if (req.file) {
      const restaurantImage = await handleImageUpload(req.file);
      updateData.image = restaurantImage;
    }

    // Remove undefined fields to avoid overwriting with undefined
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) delete updateData[key];
    });

    // Update the restaurant
    const updatedRestaurant = await restSchema.findByIdAndUpdate(
      restaurantId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedRestaurant) {
      return next(new AppError("Restaurant not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Restaurant updated successfully",
      data: updatedRestaurant,
    });
  } catch (error) {
    next(error);
  }
};


// Delete restaurant (forAdmin)
export const deleteRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get restaurant id from request params
    const { restaurantId } = req.params;
    // Check the restaurant id is present or not
    if (!restaurantId) {
      return next(new AppError("Restaurant ID is required", 400));
    }
    // Find and delete the restaurant by restaurant id
    const deletedRestaurant = await restSchema.findByIdAndDelete(restaurantId);

    if (!deletedRestaurant) {
      return next(new AppError("Restaurant not found", 404));
    }
    // Send the delete response
    res.status(200).json({
      success: true,
      message: "Restaurant deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
