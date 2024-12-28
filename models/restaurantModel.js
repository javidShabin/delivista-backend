import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },
  description: { type: String, trim: true },
  address: { type: String, required: true },
  categories: [{ type: String, required: true }], // e.g., 'Chinese', 'Fast Food'
  contact: {
    phone: { type: String, required: true, match: [/^\d{10}$/, "Phone number must be 10 digits"] },
    email: { type: String, match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"] },
  },
  openHours: {
    type: Map,
    of: String, // e.g., { Monday: "9:00 AM - 10:00 PM" }
  },
  isOpen: { type: Boolean, default: false },
  image: {
    type: String,
    default:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTL_JlCFnIGX5omgjEjgV9F3sBRq14eTERK9w&s",
  },
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 },
  },
  isVerified: { type: Boolean, default: false },
  deliveryFee: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Restaurant = mongoose.model("restaurant", restaurantSchema);

export { Restaurant };
