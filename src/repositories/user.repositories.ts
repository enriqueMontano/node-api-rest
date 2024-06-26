import { IUser, IUserCreate, IUserRepository } from "../interfaces";
import { User as MongoUser } from "../models/mongo";
import { User as MySqlUser } from "../models/mysql";

const mongoUserRepository: IUserRepository = {
  get: async (): Promise<IUser[]> => {
    return await MongoUser.find();
  },

  getById: async (id: string): Promise<IUser | null> => {
    const user = await MongoUser.findById(id);
    return user ? user : null;
  },

  getByEmail: async (email: string): Promise<IUser | null> => {
    const user = await MongoUser.findOne({ email });
    return user ? user : null;
  },

  save: async (user: IUserCreate): Promise<IUser> => {
    const newUser = new MongoUser(user);
    return await newUser.save();
  },

  delete: async (id: string): Promise<void> => {
    await MongoUser.findByIdAndDelete(id);
  },
};

const mySqlUserRepository: IUserRepository = {
  get: async (): Promise<IUser[]> => {
    const users = await MySqlUser.findAll();
    return users.map((user) => user.get({ plain: true }));
  },

  getById: async (id: string): Promise<IUser | null> => {
    const user = await MySqlUser.findByPk(id);
    return user ? user.get({ plain: true }) : null;
  },

  getByEmail: async (email: string): Promise<IUser | null> => {
    const user = await MySqlUser.findOne({ where: { email } });
    return user ? user.get({ plain: true }) : null;
  },

  save: async (user: IUserCreate): Promise<IUser> => {
    const newUser = await MySqlUser.create({ ...user });
    return newUser.get({ plain: true });
  },

  delete: async (id: string): Promise<void> => {
    await MySqlUser.destroy({ where: { id } });
  },
};

export { mongoUserRepository, mySqlUserRepository };
