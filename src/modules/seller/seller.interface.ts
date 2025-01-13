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