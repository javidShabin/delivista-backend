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