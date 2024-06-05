import { IuserCreaction } from "./user.interface";
import { AppError } from "../../utils/appError";

export const validateSignupUser = (data: IuserCreaction) => {
    // Destructer the user details as data from interface
    const { name, email, password, confirmPassword, phone } = data
    // Check the required fields are present or not
   if (!name || !email || !password || !confirmPassword || !phone) {
    throw new AppError("All fields are required", 400);
   }
   // Compare the password and conform password
   if (password !== confirmPassword) {
    throw new AppError("Passwords do not match", 400);
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw new AppError("Invalid email format", 400);
  }

  if (password.length < 6) {
    throw new AppError("Password must be at least 6 characters", 400);
  }

}