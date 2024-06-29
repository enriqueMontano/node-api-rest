export enum UserRoles {
  User = "user",
  Admin = "admin",
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  roles: UserRoles[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserCreate {
  name: string;
  email: string;
  password: string;
  roles?: UserRoles[];
}

export interface IUserRepository {
  get(): Promise<IUser[]>;
  getById(id: string): Promise<IUser | null>;
  getByEmail(email: string): Promise<IUser | null>;
  save(user: IUserCreate): Promise<IUser>;
  delete(id: string): Promise<void>;
}
