import { User } from "../models";
import { IUser, IUserCreate } from "../interfaces";

export const userService = {
  getAll: async (): Promise<IUser[] | null> => {
    return await User.find();
  },

  getOneById: async (id: string): Promise<IUser | null> => {
    return await User.findById(id);
  },

  getOneByEmail: async (email: string): Promise<IUser | null> => {
    return await User.findOne({ email });
  },

  createOne: async (data: IUserCreate): Promise<IUser | null> => {
    const user = new User(data);
    return await user.save();
  },

  deleteOneById: async (id: string) => {
    return await User.findByIdAndDelete(id);
  },
};
