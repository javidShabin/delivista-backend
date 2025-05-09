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

    // Create new menu item
    const newMenuItem = await menuSchema.create({
      productName,
      description,
      category,
      price,
      image: menuImage,
      sellerId,
      restaurantId,
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

// Update menu
export const updateMenu = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Destructure fields from request body
    const {
      productName,
      description,
      category,
      price,
      isVeg,
      isAvailable,
      isRecommended,
      tags,
    } = req.body;

    // Check if the menu item exists
    const existingMenu = await menuSchema.findById(id);
    if (!existingMenu) {
      return next(new AppError("Menu item not found", 404));
    }

    // Handle image update if a file is uploaded
    let updatedImage = existingMenu.image;
    if (req.file) {
      const uploadResult = await handleImageUpload(req.file);
      updatedImage = uploadResult;
    }

    // Prepare updated data
    const updatedData = {
      productName,
      description,
      category,
      price,
      isVeg,
      isAvailable,
      isRecommended,
      tags,
      image: updatedImage,
    };

    // Update menu
    const updatedMenu = await menuSchema.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Menu item updated successfully",
      data: updatedMenu,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a menu item by its id
export const deleteMenu = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get menu id from request parameters
    const { id } = req.params;

    // Check if the menu item exists in the database
    const menuItem = await menuSchema.findById(id);
    if (!menuItem) {
      return next(new AppError("Menu item not found", 404));
    }

    // If found, delete the menu item
    await menuSchema.findByIdAndDelete(id);

    // Send success response
    res.status(200).json({
      success: true,
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    // Forward error to global error handler
    next(error);
  }
};

// ************Get menus by association**********************
// getMenusByRestaurant
// Get menus by pagination
export const getMenusByRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { restaurantId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 8;

    if (!restaurantId) {
      throw new AppError("Restaurant not found", 400);
    }

    const skip = (page - 1) * limit;

    const [menus, total] = await Promise.all([
      menuSchema.find({ restaurantId }).skip(skip).limit(limit),
      menuSchema.countDocuments({ restaurantId }),
    ]);

    res.status(200).json({
      success: true,
      message: "Menus fetched successfully",
      menus,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    next(error);
  }
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
    // Destructer the category and restaurant id from params and query
    const { category } = req.params;
    const { restaurantId } = req.query;

    // Set the pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 8;
    const skip = (page - 1) * limit;

    // Check the category and restaurant id is present or not
    if (!category || !restaurantId) {
      throw new AppError("RestaurantId or category is required", 404);
    }
    // Find the menu by category and restaurant id, then make pagination
    // Find paginated menus
    const menus = await menuSchema
      .find({ category, restaurantId })
      .skip(skip)
      .limit(limit);

    const totalMenus = await menuSchema.countDocuments({
      category,
      restaurantId,
    });

    if (!menus || menus.length === 0) {
      res.status(404).json({
        success: false,
        message: "No menus found for this category and restaurant.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      count: menus.length,
      currentPage: page,
      totalPages: Math.ceil(totalMenus / limit),
      data: menus,
    });
  } catch (error) {
    next(error);
  }
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
    // Get restaurant id and keyword
    const { restaurantId, keyword } = req.query;
    // Set page code
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 8;
    const skip = (page - 1) * limit;
    // Check the restaurant id and keyword (search word) is present or not
    if (!restaurantId || !keyword) {
      throw new AppError("RestaurantId and keyword are required", 400);
    }
    // Regular expression
    const searchRegex = new RegExp(keyword as string, "i");

    // regular MongoDB query filter using the query language
    const filter = {
      restaurantId,
      $or: [
        { productName: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
      ],
    };

    // Count and find the menu items by keywords from request
    const total = await menuSchema.countDocuments(filter);
    const results = await menuSchema.find(filter).skip(skip).limit(limit);

    res.status(200).json({
      // send the response
      success: true,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: results,
    });
  } catch (error) {
    next(error);
  }
};
