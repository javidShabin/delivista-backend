// User main schema interface
export interface IUser {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: "customer";
  avatar?: {
    public_id: string;
    url: string;
  };
  createdAt: Date;
}

// Temp user schema interface
export interface ITempUser {
  name: string;
  email: string;
  password: string;
  phone: string;
  otp: string;
  otpExpires: Date;
  role: "customer" | "admin" | "seller";
  avatar?: {
    public_id: string;
    url: string;
  };
  createdAt: Date;
}