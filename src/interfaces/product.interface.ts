import { ObjectId } from "mongoose";
import { QueryOptions } from "./query.interface";
export interface IProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  userId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductCreate {
  name: string;
  description: string;
  category: string;
  price: number;
  userId: string;
}

export interface IProductSearchResult {
  products: IProduct[];
  total: number;
  count: number;
}

export interface IProductRepository {
  get(): Promise<IProduct[]>;
  getById(id: string): Promise<IProduct | null>;
  getByUserId(userId: string): Promise<IProduct[]>;
  search(queryOptions: QueryOptions): Promise<IProductSearchResult>;
  save(product: IProductCreate): Promise<IProduct>;
  update(id: string, product: Partial<IProduct>): Promise<IProduct | null>;
  delete(id: string): Promise<void>;
}
