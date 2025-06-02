
export interface IUser {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin" | "seller";
  avatar?: {
    public_id: string;
    url: string;
  };
  createdAt: Date;
}
export interface ITempUser {
  name: string;
  email: string;
  password: string;
  otp: string;
  otpExpires: Date;
  role: "user" | "admin" | "seller";
  avatar?: {
    public_id: string;
    url: string;
  };
  createdAt: Date;
}