import { Request, Response } from "express";
import orderSchema from "./order.model"
import addressSchema from "../address/address.model";
import { stripe } from "../../configs/stripe";

export const makePayment = async (req: Request, res: Response) => {
    try {
        const customerId = req.user?.id
        const {
            addressId,
            items,
            totalAmount,
            sellerId
        } = req.body;

        // Find the user details from db
        const isAddress = await addressSchema.findById(addressId)

        // 1. Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: items.map((item: any) => ({
                price_data: {
                    currency: "inr", // or "usd"
                    product_data: {
                        name: item.productName,
                        images: [item.image],
                    },
                    unit_amount: Math.round(item.price * 1.05 * 100),
                },
                quantity: item.quantity,
            })),
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/user/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/user/payment-failed`,
        });

        // 2. Save pending order
        const order = await orderSchema.create({
            customerId,
            sellerId,
            sessionId: session.id,
            addressId,
            fullName: isAddress?.fullName,
            address: isAddress?.address,
            city: isAddress?.city,
            phoneNumber: isAddress?.phoneNumber,
            addressType: isAddress?.addressType,
            items,
            totalAmount,
            paymentStatus: "pending",
            orderStatus: "placed",
        });

        res.status(200).json({
            success: true,
            url: session.url,
            orderId: order._id,
        });
    } catch (error: any) {
        console.error("Payment error:", error, "errprrrrrr");
        res.status(500).json({ success: false, message: error.message });
    }
};



export const verifyPayment = async (req: Request, res: Response) => {
    try {
        const { session_id } = req.query;
        if (!session_id) {
           res.status(400).json({ success: false, message: "Session ID missing" });
        }

        // 1. Retrieve session details from Stripe
        const session = await stripe.checkout.sessions.retrieve(session_id as string);

        // 2. Update order in DB
        const order = await orderSchema.findOneAndUpdate(
            { sessionId: session.id },
            {
                paymentStatus: session.payment_status === "paid" ? "success" : "failed",
                transactionId: session.payment_intent,
                orderStatus: session.payment_status === "paid" ? "confirmed" : "cancelled",
            },
            { new: true }
        );

        res.status(200).json({ success: true, order });
    } catch (error: any) {
        console.error("Verify payment error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
