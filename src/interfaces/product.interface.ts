import { Document, ObjectId } from "mongoose";
import { QueryOptions } from "./query.interface";
export interface IProduct extends Document {
  name: string;
  description: string;
  category: string;
  price: number;
  user: ObjectId;
}

export interface IProductCreate {
  name: string;
  description: string;
  category: string;
  price: number;
  user: string;
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
