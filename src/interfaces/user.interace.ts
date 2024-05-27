import { Document } from "mongoose";

export enum UserRoles {
  User = "user",
  Admin = "admin",
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  roles: UserRoles[];
}

export interface IUserCreate {
  name: string;
  email: string;
  password: string;
  roles?: UserRoles[];
}
