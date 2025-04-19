import { Request, Response, NextFunction } from "express";
import restSchema from "./rest.model";
import { handleAvatarUpload } from "./rest.service";
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
      uploadImage = await handleAvatarUpload(req.file);
    }
    // Save restaurant data to database
    const restaurant = new restSchema({
      name,
      phone,
      address,
      cuisine,
      pinCode,
      image: uploadImage,
      sellerId
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
) => {};

// Get verified restaurants
export const getVerifiedRestaurants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

// Verification restaurant for admin
export const adminVerifyingRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

// Get restaurant by ID
export const getRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

// Filter location based
export const getRestaurantBylocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

// Get restaurant statistics for admin and seller
export const getStatistics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

// Get restarant by seller ID for seller
export const getRestaurantBySeller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

// Filter restaurant by menu
export const getRestaurantByMenu = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

// Toggle restaurant status for seller (open or close)
export const toggleRestaurantStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

// Update restaurant
export const updateRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

// Delete restaurant (forAdmin)
export const deleteRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
