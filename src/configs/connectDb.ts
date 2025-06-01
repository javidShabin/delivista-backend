import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_STRING || "");
  } catch (error) {
    process.exit(1);
  }
};

export { connectDb };
