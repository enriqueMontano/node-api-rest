import {
  IProduct,
  IProductCreate,
  IProductRepository,
  IProductSearchResult,
  QueryOptions,
} from "../interfaces";
import { Product as MongoProduct } from "../models/mongo";
import { Product as MySqlProduct } from "../models/mysql";
import { buildOrderClause, buildWhereClause } from "../utils";

const mongoProductRepository: IProductRepository = {
  get: async (): Promise<IProduct[]> => {
    return await MongoProduct.find();
  },

  getByUserId: async (userId: string): Promise<IProduct[]> => {
    return await MongoProduct.find({ userId });
  },

  search: async (queryOptions: QueryOptions): Promise<IProductSearchResult> => {
    const { query = {}, sort = {}, skip = 0, limit = 10 } = queryOptions;

    const products = await MongoProduct.find(query)
      .sort(sort)
      .skip(skip as number)
      .limit(limit as number);
    const total = await MongoProduct.countDocuments(query);

    return { products, count: products.length, total };
  },

  getById: async (id: string): Promise<IProduct | null> => {
    const product = await MongoProduct.findById(id);
    if (!product) {
      return null;
    }
    return product;
  },

  save: async (product: IProductCreate): Promise<IProduct> => {
    const newProduct = new MongoProduct(product);
    return await newProduct.save();
  },

  update: async (
    id: string,
    product: Partial<IProduct>
  ): Promise<IProduct | null> => {
    return await MongoProduct.findByIdAndUpdate(id, product, { new: true });
  },

  delete: async (id: string): Promise<void> => {
    await MongoProduct.findByIdAndDelete(id);
  },
};

const mySqlProductRepository: IProductRepository = {
  get: async (): Promise<IProduct[]> => {
    const products = await MySqlProduct.findAll();
    return products.map((product) => product.get({ plain: true }));
  },

  getById: async (id: string): Promise<IProduct | null> => {
    const product = await MySqlProduct.findByPk(id);
    return product ? product.get({ plain: true }) : null;
  },

  getByUserId: async (userId: string): Promise<IProduct[]> => {
    const products = await MySqlProduct.findAll({ where: { userId } });
    return products
      ? products.map((product) => product.get({ plain: true }))
      : [];
  },

  search: async (queryOptions: QueryOptions): Promise<IProductSearchResult> => {
    const { query = {}, sort, skip = 0, limit = 10 } = queryOptions;

    const { rows, count } = await MySqlProduct.findAndCountAll({
      where: buildWhereClause(query),
      order: buildOrderClause(sort),
      limit: limit,
      offset: skip,
    });

    const products: IProduct[] = rows.map(
      (product) => product.toJSON() as IProduct
    );

    return {
      products,
      count: products.length,
      total: count,
    };
  },

  save: async (product: IProductCreate): Promise<IProduct> => {
    const newProduct = await MySqlProduct.create({ ...product });
    return newProduct.get({ plain: true });
  },

  update: async (
    id: string,
    product: Partial<IProduct>
  ): Promise<IProduct | null> => {
    const [numberOfAffectedRows] = await MySqlProduct.update(product, {
      where: { id },
      returning: true,
    });

    if (numberOfAffectedRows === 0) {
      return null;
    }

    const updatedProduct = await MySqlProduct.findByPk(id);
    return updatedProduct ? updatedProduct.get({ plain: true }) : null;
  },

  delete: async (id: string): Promise<void> => {
    await MySqlProduct.destroy({ where: { id } });
  },
};

export { mongoProductRepository, mySqlProductRepository };
