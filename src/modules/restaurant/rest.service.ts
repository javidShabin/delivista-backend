import cloudinary from "../../configs/cloudinary";
import { AppError } from "../../utils/appError";

// Handles the restaurant image upload process using Cloudinary
export const handleImageUpload = async (file: any) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(file.path);
    // Store the image url to update user data
    return uploadResult.secure_url;
  } catch (error) {
    throw new AppError("Failed to upload avatar image", 500);
  }
};
