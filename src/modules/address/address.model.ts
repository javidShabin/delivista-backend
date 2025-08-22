import mongoose, { Schema, Document, model } from "mongoose";
import { IAddress } from "./address.interface";

export interface IAddressModel extends IAddress, Document {}

// Address schema
const addressSchema = new Schema<IAddressModel>(
    {
        customerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        fullName: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        addressType: {
            type: String,
            enum: ["home", "work", "other"],
            required: true,
        },
        isDefault: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Create the model for the schema
export default model<IAddressModel>("Address", addressSchema);
