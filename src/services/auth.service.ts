import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUserRepository } from "../interfaces";
import { HttpError } from "../middlewares";
import { authConfig } from "../configs";

export class AuthService {
  constructor(private userRepository: IUserRepository) {}

  async signUp(name: string, email: string, password: string): Promise<void> {
    const emailAlreadyExists = await this.userRepository.getByEmail(email);
    if (emailAlreadyExists) {
      throw new HttpError("Email address already in use", 400);
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    await this.userRepository.save({ name, email, password: hashedPassword });
  }

  async signIn(email: string, password: string): Promise<string> {
    const user = await this.userRepository.getByEmail(email);
    if (!user) {
      throw new HttpError("We could not find your email in our system", 403);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new HttpError("Wrong password", 403);
    }

    const accesToken = jwt.sign({ userId: user._id }, authConfig.jwtSecret, {
      expiresIn: authConfig.jwtExpiration,
    });

    return accesToken;
  }
}
