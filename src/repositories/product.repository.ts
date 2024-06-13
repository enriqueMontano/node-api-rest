import { QueryOptions } from "mongoose";
import { IProduct, IProductCreate, IProductSearchResult } from "../interfaces";
import { Product } from "../models";

export const mongoProductRepository = {
  get: async (): Promise<IProduct[]> => {
    return await Product.find();
  },

  getByUserId: async (userId: string): Promise<IProduct[]> => {
    return await Product.find({ user: userId });
  },

  search: async (queryOptions: QueryOptions): Promise<IProductSearchResult> => {
    const { query = {}, sort = {}, skip = 0, limit = 10 } = queryOptions;

    const products = await Product.find(query)
      .sort(sort)
      .skip(skip as number)
      .limit(limit as number);
    const total = await Product.countDocuments(query);

    return { products, count: products.length, total };
  },

  getById: async (id: string): Promise<IProduct | null> => {
    const product = await Product.findById(id);
    if (!product) {
      return null;
    }
    return product;
  },

  save: async (product: IProductCreate): Promise<IProduct> => {
    const newProduct = new Product(product);
    return await newProduct.save();
  },

  update: async (
    id: string,
    product: Partial<IProduct>
  ): Promise<IProduct | null> => {
    return await Product.findByIdAndUpdate(id, product, { new: true });
  },

  delete: async (id: string): Promise<void> => {
    await Product.findByIdAndDelete(id);
  },
};
