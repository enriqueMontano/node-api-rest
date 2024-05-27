import { Document, ObjectId } from "mongoose";

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
