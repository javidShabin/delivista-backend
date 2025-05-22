// Admin main schema interface
export interface IAdmin {
    name: string;
    email: string;
    password: string;
    role: "customer";
    avatar?:{
        public_id: string;
        url: string;
    };
    createdAt: Date;
}