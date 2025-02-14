// interfaces/user.interface.ts
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
