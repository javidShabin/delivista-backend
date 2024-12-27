import mongoose from "mongoose";

const { Schema, model } = mongoose;

// Define the schema
const restaurantSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming User model exists for owners
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    location: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
    contact: {
      phone: { type: String, required: true },
      email: { type: String, required: true },
    },
    socialLinks: {
      facebook: { type: String },
      instagram: { type: String },
      twitter: { type: String },
      website: { type: String },
    },
    timings: [
      {
        day: {
          type: String,
          enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          required: true,
        },
        openingTime: { type: String, required: true }, // e.g., '09:00 AM'
        closingTime: { type: String, required: true }, // e.g., '10:00 PM'
      },
    ],
    menu: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Menu", // Assuming Menu model exists
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review", // Assuming Review model exists
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    images: {
      coverImage: { type: String, required: true }, // Cover image URL
      gallery: [String], // Array of gallery image URLs
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Add geospatial index
restaurantSchema.index({ location: "2dsphere" });

// Export the model
const Restaurant = model("Restaurant", restaurantSchema);

export {Restaurant};
