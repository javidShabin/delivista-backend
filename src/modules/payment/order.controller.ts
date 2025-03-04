import { Request, Response, NextFunction } from "express";
import orderSchema from "./order.model"
import { AppError } from "../../utils/appError";

export const orderListByCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get customer id from authentication
        const customerId = req.user?.id;

        if (!customerId) {
            return next(new AppError("Customer not authenticated", 401));
        }

        // Find all orders by customer
        const orderList = await orderSchema.find({ customerId });

        if (!orderList || orderList.length === 0) {
            return next(new AppError("No orders found", 404));
        }

        // Send response
        res.status(200).json({
            message: "Fetched all orders for the customer",
            data: orderList
        });

    } catch (error: any) {
        next(error);
    }
}
// Get the single order by id
export const singleOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { orderId } = req.params;

        if (!orderId) {
            return next(new AppError("Order ID is required", 400));
        }

        const order = await orderSchema.findById(orderId);

        if (!order) {
            return next(new AppError("Order not found", 404));
        }

        res.status(200).json({
            message: "Fetched single order",
            data: order,
        });
    } catch (error) {
        next(error);
    }
};

// Cancel the order
export const orderCancel = async (req: Request, res: Response, next: NextFunction) => {
    try {

    } catch (error) {

    }
}

// Get orders for restaurants
export const orderListBySeller = async (req: Request, res: Response, next: NextFunction) => {
    try {

    } catch (error) {

    }
}