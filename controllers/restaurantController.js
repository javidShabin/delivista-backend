// Restaurant Controller
import { cloudinaryInstance } from "../config/cloudinaryConfig.js";
import { Restaurant } from "../models/restaurantModel.js";

export const createRestaurant = async (req, res) => {
  try {
    const { seller } = req;
    const {
      name,
      description,
      address,
      categories,
      phone,
      openHours,
      isOpen,
      deliveryFee,
    } = req.body;

    if (!seller) {
      return res
        .status(401)
        .json({ message: "Unauthorized access: Seller not found." });
    }

    if (!name || !address || !categories || !phone) {
      return res.status(400).json({
        message: "Name, address, categories, and contact phone are required.",
      });
    }

    if (!/^[a-zA-Z, ]+$/.test(categories)) {
      return res.status(400).json({ message: "Categories must be valid." });
    }

    if (!/^(\d{10})$/.test(phone)) {
      return res
        .status(400)
        .json({ message: "Phone number must be 10 digits." });
    }

    const existingRestaurant = await Restaurant.findOne({ name });
    if (existingRestaurant) {
      return res.status(409).json({ message: "Restaurant already exists." });
    }

    let imageUrl = "";
    if (req.file) {
      try {
        const uploadResult = await cloudinaryInstance.uploader.upload(
          req.file.path
        );
        imageUrl = uploadResult.secure_url;
      } catch (error) {
        return res
          .status(500)
          .json({ message: "Failed to upload image. Please try again later." });
      }
    }

    const newRestaurant = new Restaurant({
      name,
      sellerId: seller.id,
      description,
      address,
      categories,
      phone,
      openHours,
      isOpen,
      image: imageUrl,
      deliveryFee,
    });

    const savedRestaurant = await newRestaurant.save();

    res.status(201).json({
      message: "Restaurant created successfully.",
      restaurant: savedRestaurant,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const getRestaurantById = async (req, res) => {
  try {
    // Get the id from req
    const restautantId = req.params.id;

    // Find the restaurant details using the id
    const restaurant = await Restaurant.findById(restautantId);
    // Check the resstauratn available in the id
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
