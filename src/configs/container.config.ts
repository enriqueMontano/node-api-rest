import { IProductRepository, IUserRepository } from "../interfaces";
import { mongoProductRepository, mongoUserRepository } from "../repositories";

const userRepository: IUserRepository = mongoUserRepository;
const productRepository: IProductRepository = mongoProductRepository;

export { userRepository, productRepository };
