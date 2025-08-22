import { Types } from "mongoose";

// Address schema interface
export interface IAddress {
    customerId: Types.ObjectId;
    fullName: string;
    phoneNumber: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    addressType: "home" | "work" | "other";
    isDefault: boolean;
}
