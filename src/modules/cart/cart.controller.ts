import { Request, Response, NextFunction } from "express";
import cartSchema from "./cart.model";
import { AppError } from "../../utils/appError";

// *************Main Cart CRUD Operations********************

// Add item to the cart
export const addToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {}
};

// Update the cart
export const updateCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {}
};

// Delete item from the cart
export const deleteFromCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {}
};

// ************Get menus by association**********************

// Get the cart by user id
export const getCartByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {}
};

// Get the cart by seller id
export const getCartBySellerId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {}
};