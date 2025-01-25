// Seller main schema interface
export interface ISeller {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: "seller";
  coverImage?: string;
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
  coverImage?: string;
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

