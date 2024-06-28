import { IUser, IUserCreate, IUserRepository } from "../interfaces";
import { User as MongoUser } from "../models/mongo";
import { User as MySqlUser } from "../models/mysql";

class MongoUserRepository implements IUserRepository {
  async get(): Promise<IUser[]> {
    return await MongoUser.find();
  }

  async getById(id: string): Promise<IUser | null> {
    const user = await MongoUser.findById(id);
    return user ? user : null;
  }

  async getByEmail(email: string): Promise<IUser | null> {
    const user = await MongoUser.findOne({ email });
    return user ? user : null;
  }

  async save(user: IUserCreate): Promise<IUser> {
    const newUser = new MongoUser(user);
    return await newUser.save();
  }

  async delete(id: string): Promise<void> {
    await MongoUser.findByIdAndDelete(id);
  }
}

class MySqlUserRepository implements IUserRepository {
  async get(): Promise<IUser[]> {
    const users = await MySqlUser.findAll();
    return users.map((user) => user.get({ plain: true }));
  }

  async getById(id: string): Promise<IUser | null> {
    const user = await MySqlUser.findByPk(id);
    return user ? user.get({ plain: true }) : null;
  }

  async getByEmail(email: string): Promise<IUser | null> {
    const user = await MySqlUser.findOne({ where: { email } });
    return user ? user.get({ plain: true }) : null;
  }

  async save(user: IUserCreate): Promise<IUser> {
    const newUser = await MySqlUser.create({ ...user });
    return newUser.get({ plain: true });
  }

  async delete(id: string): Promise<void> {
    await MySqlUser.destroy({ where: { id } });
  }
}

export { MongoUserRepository, MySqlUserRepository };
