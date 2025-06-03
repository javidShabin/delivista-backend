import { v2 as cloudinary, ConfigOptions } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const cloudinaryConfig: ConfigOptions = {
  cloud_name: process.env.CLOUD_NAME || "",
  api_key: process.env.CLOUD_API_KEY || "",
  api_secret: process.env.CLOUD_API_SECRET || "",
};

cloudinary.config(cloudinaryConfig);

export default cloudinary;
