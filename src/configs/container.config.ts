import { IUserRepository } from "../interfaces";
import { mongoUserRepository } from "../repositories";

const userRepository: IUserRepository = mongoUserRepository;

export { userRepository };
