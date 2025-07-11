import { Request, Response, NextFunction } from "express";
import menuSchema from "./menu.model";
import { AppError } from "../../utils/appError";
import { validateMenuCreation } from "./menu.validation";
import restaurantSchema from "../restaurant/rest.model";
import { handleImageUpload } from "../../shared/cloudinary/upload.file";

// *************Main Menu CRUD Operations********************
// Create a new menu item
export const createMenu = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate the details first
    validateMenuCreation(req.body);
    // Destructure the menu details from request body after validation
    const {
      productName,
      description,
      category,
      price,
      restaurantId,
      sellerId,
      variants,
      isVeg,
      tags,
    } = req.body;
    // Check the same item already exists in the menu collection
    const isMenuItemExist = await menuSchema.findOne({
      productName,
      restaurantId,
    });
    if (isMenuItemExist) {
      return next(new AppError("The item already exists", 400));
    }
    // Check the restarant is verified
    const isVerifiedRestaurant = await restaurantSchema.findById(restaurantId);
    if (!isVerifiedRestaurant) {
      return next(new AppError("Restaurant not verified", 400));
    }
    let menuImage;
    // If any file is uploaded, handle the image upload and get the file path
    if (req.file) {
      const uploadImage = await handleImageUpload(req.file);
      menuImage = uploadImage;
    }
    let parsedVariants = variants;
    if (typeof variants === "string") {
      try {
        parsedVariants = JSON.parse(variants);
      } catch (err) {
        return next(new AppError("Invalid format for variants", 400));
      }
    }
    // Create new menu item
    const newMenuItem = await menuSchema.create({
      productName,
      description,
      category,
      price,
      image: menuImage,
      sellerId,
      restaurantId,
      variants: parsedVariants,
      isVeg,
      tags,
    });
    res.status(201).json({
      success: true,
      message: "Menu item created successfully",
      data: newMenuItem,
    });
  } catch (error) {
    next(error);
  }
};

// updateMenu
export const updateMenu = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {}
};

// deleteMenu
export const deleteMenu = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {}
};

// ************Get menus by association**********************
// getMenusByRestaurant
export const getMenusByRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {}
};

// getMenusBySeller
export const getMenusBySeller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {}
};

// ************Filtering functions for menus**********************
// getMenusByCategory
export const getMenusByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {}
};

// getMenusByPriceRange
export const getMenusByPriceRange = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {}
};

// getMenusByTag
export const getMenusByTag = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {}
};

// getMenusByAvailability
export const getMenusByAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {}
};

// getRecommendedMenus
export const getRecommendedMenus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {}
};

// getVegMenus
export const getVegMenus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {}
};

// getNonVegMenus
export const getNonVegMenus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {}
};

// get menus by search
export const searchMenus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {}
};
