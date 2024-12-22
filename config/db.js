import { connect } from "mongoose";

export const connectDb = async () => {
  try {
    await connect(process.env.DB_CONNECTION_STRING);
    console.log("Database connected")
  } catch (error) {
    console.log(error)
  }
};
