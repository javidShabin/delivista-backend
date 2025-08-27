import { Types } from 'mongoose';

export interface IOrder {
    userId: Types.ObjectId;
    addressId: Types.ObjectId;
    items: {
        menuId: Types.ObjectId;
        name: string;
        quantity: number;
        price: number;
    }[];
    totalAmount: number;
    paymentIntentId?: string; // Stripe payment intent ID
    sessionId?: string;
    paymentStatus: 'pending' | 'paid' | 'failed';
    orderStatus: 'pending' | 'processing' | 'completed' | 'cancelled';
    createdAt?: Date;
    updatedAt?: Date;
}
