import { Restaurant } from "../models/restaurantModel.js";

// Create a new restaurant
export const createRestaurant = async (req, res) => {
  try {
    const { sellerId } = req.params; // Extract seller ID from URL
    const {
      name,
      description,
      address,
      location,
      contact,
      socialLinks,
      timings,
      images,
    } = req.body;

    // Validate required fields
    if (!name || !address || !location || !contact || !images?.coverImage) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: name, address, location, contact, or coverImage",
      });
    }

    // Validate location format
    if (
      !Array.isArray(location.coordinates) ||
      location.coordinates.length !== 2
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid location format. Must be an array [longitude, latitude]",
      });
    }

    // Check for duplicate restaurant names for the same seller
    const existingRestaurant = await Restaurant.findOne({
      seller: sellerId,
      name: name.trim(),
    });

    if (existingRestaurant) {
      return res.status(409).json({
        success: false,
        message: "A restaurant with this name already exists for the seller",
      });
    }

    // Create and save the restaurant
    const restaurant = await Restaurant.create({
      name: name.trim(),
      seller: sellerId,
      description: description?.trim(),
      address,
      location,
      contact,
      socialLinks,
      timings,
      images,
    });

    res.status(201).json({
      success: true,
      message: "Restaurant created successfully",
      data: restaurant,
    });
  } catch (error) {
    console.error("Error creating restaurant:", error);

    // Advanced error response for MongoDB validation or system errors
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the restaurant",
      error: error.message,
    });
  }
};
