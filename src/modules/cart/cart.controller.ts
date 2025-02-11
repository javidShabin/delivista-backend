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
): Promise<void> => {
  try {
    // Ensure customerId comes from the authenticated user
    const userId = req.user?.id;
    if (!userId) {
      return next(new AppError("Unauthorized", 401));
    }
    // Force the customerId to match the authenticated user to keep cart retrieval consistent
    req.body.customerId = userId as any;

    // Validate the data from request body
    validateCartCreation(req.body);

    // Destructure data from request body
    const { sellerId, customerId, restaurantId, items } = req.body;

    // Validate all items contain menuId
    for (const item of items) {
      if (!item.menuId) {
        return next(new AppError("Each item must include a valid menuId", 400));
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

      const duplicateIds = incomingMenuIds.filter((id: any) =>
        existingMenuIds.includes(id)
      );

      if (duplicateIds.length > 0) {
        res.status(400).json({
          status: "error",
          message: "One or more menu items already exist in the cart",
        });
        return;
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
      customerId: userId,
      restaurantId,
      totalPrice,
      items,
    });

    res.status(201).json({
      message: "Cart created and items added",
      cart: newCart,
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

// Update the cart
export const updateCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get user id from authentication
    const userId = req.user?.id;
    if (!userId) {
      return next(new AppError("Unauthorized", 401));
    }

    // Get the menu id and action from request body
    const { menuId, action } = req.body;

    // Check if menu id and action are present
    if (!menuId) {
      return next(new AppError("Menu ID is required", 400));
    }

    if (!action || !['increment', 'decrement'].includes(action)) {
      return next(new AppError("Action must be 'increment' or 'decrement'", 400));
    }

    // Find the user's cart
    const cart = await cartSchema.findOne({ customerId: userId });
    if (!cart) {
      return next(new AppError("Cart not found", 404));
    }

    // Check if the item exists in the cart
    const itemIndex = cart.items.findIndex(
      (item: any) => item.menuId.toString() === menuId.toString()
    );

    if (itemIndex === -1) {
      return next(new AppError("Menu item not found in cart", 404));
    }

    const item = cart.items[itemIndex];
    const oldTotal = item.price * item.quantity;

    // Update quantity based on action
    if (action === 'increment') {
      item.quantity += 1;
    } else if (action === 'decrement') {
      if (item.quantity <= 1) {
        return next(new AppError("Quantity cannot be less than 1", 400));
      }
      item.quantity -= 1;
    }

    // Calculate new total for this item
    const newTotal = item.price * item.quantity;

    // Update cart total price
    cart.totalPrice = cart.totalPrice - oldTotal + newTotal;

    // Ensure totalPrice doesn't go negative
    if (cart.totalPrice < 0) {
      cart.totalPrice = 0;
    }

    // Save updated cart
    const updatedCart = await cart.save();

    res.status(200).json({
      message: `Item quantity ${action === 'increment' ? 'increased' : 'decreased'} successfully`,
      cart: updatedCart,
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};


// Delete item from the cart
export const deleteFromCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get user id from authenticaton
    const userId = req.user?.id;
    // Get the menu id from request body
    const { menuId } = req.body;
    // Check the menu id is present
    if (!menuId) {
      return next(new AppError("Menu ID is required", 400));
    }

    // Find the user's cart
    const cart = await cartSchema.findOne({ customerId: userId });
    if (!cart) {
      return next(new AppError("Cart not found", 404));
    }

    // Check if the item exists in the cart
    const itemIndex = cart.items.findIndex(
      (item: any) => item.menuId.toString() === menuId.toString()
    );

    if (itemIndex === -1) {
      return next(new AppError("Menu item not found in cart", 404));
    }

    // Remove the item
    const removedItem = cart.items.splice(itemIndex, 1)[0];
    // Update total price
    cart.totalPrice -= removedItem.price * removedItem.quantity;

    // Ensure totalPrice doesn't go negative
    if (cart.totalPrice < 0) {
      cart.totalPrice = 0;
    }

    // Save updated cart
    const updatedCart = await cart.save();

    res.status(200).json({
      message: "Item removed from cart successfully",
      cart: updatedCart,
    });
  } catch (error) {
    next(error);
  }
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
  } catch (error) { }
};

// ********************* Remove cart ***************************
// remove the cart
// remove the cart
export const deleteCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const customerId = req.user?.id; // comes from auth middleware

    if (!customerId) {
      return next(new AppError("Unauthorized", 401));
    }

    const isCart = await cartSchema.findOneAndDelete({ customerId });

    if (!isCart) {
      return next(new AppError("Cart not found", 404));
    }

    res.status(200).json({ message: "Remove cart successful" });
  } catch (error) {
    next(error);
  }
};
