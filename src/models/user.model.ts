import { Schema, model } from "mongoose";
import { IUser, UserRoles } from "../interfaces";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: {
      type: [String],
      required: true,
      enum: UserRoles,
      default: [UserRoles.User],
    },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
