import {
  IProduct,
  IProductCreate,
  IProductRepository,
  IProductSearchResult,
  QueryOptions,
} from "../interfaces";
import { Product as MongoProduct } from "../models/mongo";
import { Product as SqlProduct } from "../models/sql";
import { buildOrderClause, buildWhereClause } from "../utils";

class MongoProductRepository implements IProductRepository {
  async get(): Promise<IProduct[]> {
    return await MongoProduct.find();
  }

  async getById(id: string): Promise<IProduct | null> {
    const product = await MongoProduct.findById(id);
    return product ? product : null;
  }

  async getByUserId(userId: string): Promise<IProduct[]> {
    return await MongoProduct.find({ userId });
  }

  async search(queryOptions: QueryOptions): Promise<IProductSearchResult> {
    const { query = {}, sort = {}, skip = 0, limit = 10 } = queryOptions;

    const products = await MongoProduct.find(query)
      .sort(sort)
      .skip(skip as number)
      .limit(limit as number);
    const total = await MongoProduct.countDocuments(query);

    return { products, count: products.length, total };
  }

  async save(product: IProductCreate): Promise<IProduct> {
    const newProduct = new MongoProduct(product);
    return await newProduct.save();
  }

  async update(
    id: string,
    product: Partial<IProduct>
  ): Promise<IProduct | null> {
    return await MongoProduct.findByIdAndUpdate(id, product, { new: true });
  }

  async delete(id: string): Promise<void> {
    await MongoProduct.findByIdAndDelete(id);
  }
}

class SqlProductRepository implements IProductRepository {
  async get(): Promise<IProduct[]> {
    const products = await SqlProduct.findAll();
    return products.map((product) => product.get({ plain: true }));
  }

  async getById(id: string): Promise<IProduct | null> {
    const product = await SqlProduct.findByPk(id);
    return product ? product.get({ plain: true }) : null;
  }

  async getByUserId(userId: string): Promise<IProduct[]> {
    const products = await SqlProduct.findAll({ where: { userId } });
    return products.map((product) => product.get({ plain: true }));
  }

  async search(queryOptions: QueryOptions): Promise<IProductSearchResult> {
    const { query = {}, sort, skip = 0, limit = 10 } = queryOptions;

    const { rows, count } = await SqlProduct.findAndCountAll({
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
  }

  async save(product: IProductCreate): Promise<IProduct> {
    const newProduct = await SqlProduct.create({ ...product });
    return newProduct.get({ plain: true });
  }

  async update(
    id: string,
    product: Partial<IProduct>
  ): Promise<IProduct | null> {
    const [numberOfAffectedRows] = await SqlProduct.update(product, {
      where: { id },
      returning: true,
    });

    if (numberOfAffectedRows === 0) {
      return null;
    }

    const updatedProduct = await SqlProduct.findByPk(id);
    return updatedProduct ? updatedProduct.get({ plain: true }) : null;
  }

  async delete(id: string): Promise<void> {
    await SqlProduct.destroy({ where: { id } });
  }
}

export { MongoProductRepository, SqlProductRepository };
