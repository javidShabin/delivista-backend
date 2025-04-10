// Seller main schema interface
export interface ISeller {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: "seller";
  avatar?: {
    public_id: string;
    url: string;
  };
  createdAt: Date;
}
// Temp seller schema interface
export interface ITempSeller {
  name: string;
  email: string;
  password: string;
  phone: string;
  otp: string;
  otpExpires: Date;
  role: "seller";
  avatar?: {
    public_id: string;
    url: string;
  };
  createdAt: Date;
}
// Seller signup interface
export interface IsellerCreation {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}
// Seller otp verifying interface
export interface IsellerOTPverifying {
  email: string;
  otp: string;
}
// Seller login interface
export interface IsellerLogin {
  email: string;
  password: string;
}
// Password updating interface
export interface IupdateSellerPassword {
  email: string;
  password: string;
  confirmPassword: string;
}