import { Request, Response, NextFunction } from "express";
import cartSchema from "./cart.model";
import { AppError } from "../../utils/appError";
import { validateCartCreation } from "./cart.validation";

// *************Main Cart CRUD Operations********************

// Add item to the cart
export const addToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void>  => {
  try {
    // Validate the data from request body
    validateCartCreation(req.body);

    // Destructure data from request body
    const { sellerId, customerId, restaurantId, items } = req.body;

    console.log(sellerId)

    // Validate all items contain menuId
    for (const item of items) {
      if (!item.menuId) {
        throw new AppError("Each item must include a valid menuId", 400);
      }
    }

    // Extract menuIds safely
    const incomingMenuIds = items
      .filter((item: any) => item.menuId)
      .map((item: any) => item.menuId.toString());

    // Find existing cart
    const existingCart = await cartSchema.findOne({
      sellerId,
      customerId,
      restaurantId,
    });

    if (existingCart) {
      const existingMenuIds = existingCart.items
        .filter((item: any) => item.menuId)
        .map((item: any) => item.menuId.toString());

      const duplicateIds = incomingMenuIds.filter((id:any) =>
        existingMenuIds.includes(id)
      );

      if (duplicateIds.length > 0) {
         res.status(400).json({
          status: "error",
          message: "One or more menu items already exist in the cart",
        });
      }

      // No duplicates — add new items
      existingCart.items.push(...items);

      // Update total price
      existingCart.totalPrice += items.reduce(
        (total: number, item: any) => total + item.price * item.quantity,
        0
      );

      const updatedCart = await existingCart.save();

      res.status(200).json({
        message: "Items added to existing cart",
        cart: updatedCart,
      });
      return;
    }

    // No existing cart — create new
    const totalPrice = items.reduce(
      (total: number, item: any) => total + item.price * item.quantity,
      0
    );

    const newCart = await cartSchema.create({
      sellerId,
      customerId,
      restaurantId,
      totalPrice,
      items,
    });

    res.status(201).json({
      message: "Cart created and items added",
      cart: newCart,
    });
  } catch (error) {
    next(error);
  }
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
    // Get customer id from user authentication
    const userId = req.user?.id;

    if (!userId) {
      return next(new AppError("Unauthorized", 401));
    }
    // Find the cart by customer id
    const cart = await cartSchema.findOne({ customerId: userId });
    // If not find the cart return error
    if (!cart) {
      throw new AppError("Cart not found", 404);
    }
    // Send as a response
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
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