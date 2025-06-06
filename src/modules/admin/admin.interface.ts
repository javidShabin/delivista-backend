// Admin main schema interface
export interface IAdmin {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: "admin";
    avatar?:{
        public_id: string;
        url: string;
    };
    createdAt: Date;
}
// Temp admin schema interface
export interface ITempAdmin {
    name: string;
    email: string;
    password: string;
    phone: string;
    otp: string;
    otpExpires: Date;
    role: "admin";
    avatar?: {
        public_id: string;
        url: string;
    };
    createdAt: Date;
}

// Admin signup interface
export interface IadminCreation {
    name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}



