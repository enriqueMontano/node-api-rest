import { IUser, IUserCreate, IUserRepository } from "../interfaces";

export class UserService {
  constructor(private repository: IUserRepository) {}

  async get(): Promise<IUser[]> {
    return this.repository.get();
  }

  async getById(id: string): Promise<IUser | null> {
    return this.repository.getById(id);
  }

  async getByEmail(email: string): Promise<IUser | null> {
    return this.repository.getByEmail(email);
  }

  async save(user: IUserCreate): Promise<IUser> {
    return await this.repository.save(user);
  }

  async deleteUser(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
