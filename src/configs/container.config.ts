import { IProductRepository, IUserRepository } from "../interfaces";
import { databaseType } from "./dbs.config";
import {
  MongoProductRepository,
  MongoUserRepository,
  MySqlUserRepository,
  MySqlProductRepository,
} from "../repositories";

let productRepository: IProductRepository;
let userRepository: IUserRepository;

if (databaseType === "mongo") {
  productRepository = new MongoProductRepository();
  userRepository = new MongoUserRepository();
} else if (databaseType === "mysql") {
  productRepository = new MySqlProductRepository();
  userRepository = new MySqlUserRepository();
} else {
  throw new Error("Invalid DATABASE_TYPE specified");
}

export { userRepository, productRepository };
