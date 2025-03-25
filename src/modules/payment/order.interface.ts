import { Types } from "mongoose";

// Order schema interface
export interface IOrder {
    customerId: Types.ObjectId;
    sessionId: string;

    // Address
    addressId: Types.ObjectId;
    fullName: string;
    address: string;
    city: string;
    phoneNumber: string;
    addressType: string;

    // Items in the order
    items: {
        menuId: Types.ObjectId;
        productName: string;
        quantity: number;
        image: string;
        isVeg: boolean;
        tags: string[];
        category: string;
        price: number;
    }[];

    // Pricing
    totalAmount: number;

    // Payment & order status
    paymentStatus: "pending" | "success" | "failed";
    transactionId?: string;
    orderStatus: "placed" | "confirmed" | "shipped" | "delivered" | "cancelled";

    // Metadata
    createdAt?: Date;
    updatedAt?: Date;
}
