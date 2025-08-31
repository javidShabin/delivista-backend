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
        // Get the order id form request params
        const { orderId } = req.params;

        if (!orderId) {
            return next(new AppError("Order ID is required", 400));
        }
        // Find the order by id
        const order = await orderSchema.findById(orderId);

        if (!order) {
            return next(new AppError("Order not found", 404));
        }
        // Send response to client
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
        
        // Get order id from params
        const { orderId } = req.params;
        const customerId = req.user?.id;


        if (!customerId) {
            return next(new AppError("Customer not authenticated", 401));
        }

        if (!orderId) {
            return next(new AppError("Order ID is required", 400));
        }

        // Find the order
        const order = await orderSchema.findById(orderId);

        if (!order) {
            return next(new AppError("Order not found", 404));
        }

        // Ensure the order belongs to the customer
        if (order.customerId.toString() !== customerId.toString()) {
            return next(new AppError("You are not authorized to cancel this order", 403));
        }

        // Prevent cancelling if already cancelled or delivered
        if (order.orderStatus === "cancelled") {
            return next(new AppError("Order is already cancelled", 400));
        }
        if (order.orderStatus === "delivered") {
            return next(new AppError("Delivered orders cannot be cancelled", 400));
        }

        // Update status
        const updatedOrder = await orderSchema.findByIdAndUpdate(
            orderId,
            { orderStatus: "cancelled" },
            { new: true, runValidators: false }
        );

        res.status(200).json({
            message: "Order cancelled successfully",
            data: updatedOrder,
        });
    } catch (error) {
        next(error);
    }
};


// Get orders for restaurants
export const orderListBySeller = async (req: Request, res: Response, next: NextFunction) => {
    try {

    } catch (error) {

    }
}