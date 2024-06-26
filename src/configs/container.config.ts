import { IProductRepository, IUserRepository } from "../interfaces";
import { databaseType } from "./dbs.config";
import {
  mongoProductRepository,
  mongoUserRepository,
  mySqlUserRepository,
  mySqlProductRepository,
} from "../repositories";

let productRepository: IProductRepository;
let userRepository: IUserRepository;

if (databaseType === "mongo") {
  productRepository = mongoProductRepository;
  userRepository = mongoUserRepository;
} else if (databaseType === "mysql") {
  productRepository = mySqlProductRepository;
  userRepository = mySqlUserRepository;
} else {
  throw new Error("Invalid DATABASE_TYPE specified");
}

export { userRepository, productRepository };
