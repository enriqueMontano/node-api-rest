import { IUser, IUserCreate } from "../interfaces";
import { User } from "../models";

export const mongoUserRepository = {
  get: async (): Promise<IUser[]> => {
    return await User.find();
  },

  getById: async (id: string): Promise<IUser | null> => {
    const user = await User.findById(id);
    if (!user) {
      return null;
    }
    return user;
  },

  getByEmail: async (email: string): Promise<IUser | null> => {
    const user = await User.findOne({ email });
    if (!user) {
      return null;
    }
    return user;
  },

  save: async (user: IUserCreate): Promise<IUser> => {
    const newUser = new User(user);
    return await newUser.save();
  },

  delete: async (id: string): Promise<void> => {
    await User.findByIdAndDelete(id);
  },
};
