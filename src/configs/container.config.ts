import {
  DatabaseType,
  IProductRepository,
  IUserRepository,
} from "../interfaces";
import { databaseType } from "./dbs.config";
import {
  MongoProductRepository,
  MongoUserRepository,
  SqlUserRepository,
  SqlProductRepository,
} from "../repositories";

let productRepository: IProductRepository;
let userRepository: IUserRepository;

if (databaseType === DatabaseType.MongoDB) {
  productRepository = new MongoProductRepository();
  userRepository = new MongoUserRepository();
} else if (
  databaseType === DatabaseType.MySQL ||
  databaseType === DatabaseType.PostgreSQL
) {
  productRepository = new SqlProductRepository();
  userRepository = new SqlUserRepository();
} else {
  throw new Error("Invalid DB_TYPE specified");
}

export { userRepository, productRepository };
