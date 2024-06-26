import {
  IProduct,
  IProductCreate,
  QueryOptions,
  IProductSearchResult,
  IProductRepository,
} from "../interfaces";
import { HttpError } from "../middlewares";
import { UserRoles } from "../interfaces";
import { isProductOwner } from "../utils";
import mongoose, { ObjectId } from "mongoose";
import { databaseType } from "../configs";
import { UUID } from "crypto";

export class ProductService {
  constructor(private repository: IProductRepository) {}

  async get(): Promise<IProduct[]> {
    return this.repository.get();
  }

  async getByUserId(userId: string): Promise<IProduct[]> {
    return this.repository.getByUserId(userId);
  }

  async search(queryOptions: QueryOptions): Promise<IProductSearchResult> {
    return this.repository.search(queryOptions);
  }

  async getById(id: string): Promise<IProduct | null> {
    return this.repository.getById(id);
  }

  async createOne(product: IProductCreate): Promise<IProduct> {
    return await this.repository.save(product);
  }

  async update(
    id: string,
    data: Partial<IProduct>,
    userRoles: UserRoles[]
  ): Promise<IProduct | null> {
    const product = await this.repository.getById(id);
    if (!product) {
      throw new HttpError("Product not found", 404);
    }

    const userId: string = id;
    let productUserId: string | ObjectId | UUID;
    if (product.userId instanceof mongoose.Types.ObjectId) {
      productUserId = product.userId.toHexString();
    } else {
      productUserId = product.userId as unknown as string;
    }

    const isOwner = isProductOwner(userId, productUserId);
    const isAdmin = userRoles.includes(UserRoles.Admin);
    if (!isAdmin && !isOwner) {
      throw new HttpError("Forbidden", 403);
    }

    return await this.repository.update(id, data);
  }

  async delete(id: string, userRoles: UserRoles[]): Promise<void> {
    const product = await this.repository.getById(id);
    if (!product) {
      throw new HttpError("Product not found", 404);
    }

    const userId: string = id;
    let productUserId: string | ObjectId | UUID;
    if (product.userId instanceof mongoose.Types.ObjectId) {
      productUserId = product.userId.toHexString();
    } else {
      productUserId = product.userId as unknown as string;
    }

    const isOwner = isProductOwner(userId, productUserId);
    const isAdmin = userRoles.includes(UserRoles.Admin);
    if (!isAdmin && !isOwner) {
      throw new HttpError("Forbidden", 403);
    }

    await this.repository.delete(id);
  }
}
