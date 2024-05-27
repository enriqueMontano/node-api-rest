import { Product } from "../models";
import {
  IProduct,
  IProductCreate,
  QueryOptions,
  IProductSearchResult,
} from "../interfaces";

export const productService = {
  getAll: async (): Promise<IProduct[] | null> => {
    return await Product.find();
  },

  search: async (queryOptions: QueryOptions): Promise<IProductSearchResult> => {
    const { query, sort, skip, limit } = queryOptions;

    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);
    const total = await Product.countDocuments(query);

    return { products, count: products.length, total };
  },

  getByUser: async (userId: string): Promise<IProduct[] | null> => {
    return await Product.find({ user: userId });
  },

  getOneById: async (id: string): Promise<IProduct | null> => {
    return await Product.findById(id);
  },

  createOne: async (data: IProductCreate): Promise<IProduct | null> => {
    const product = new Product(data);
    return await product.save();
  },

  updateOneById: async (
    id: string,
    data: Partial<IProduct>
  ): Promise<IProduct | null> => {
    return await Product.findByIdAndUpdate(id, data, { new: true });
  },

  deleteOneById: async (id: string): Promise<IProduct | null> => {
    return await Product.findByIdAndDelete(id);
  },
};
