// User main schema interface
export interface IUser {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: "customer" | "admin" | "seller";
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
// User signup interface
export interface IuserCreaction {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}
// User login interface
export interface IuserOTPverifying {
  email: string;
  otp: string;
}
// User login interface
export interface IuserLogin {
  email: string;
  password: string;
}