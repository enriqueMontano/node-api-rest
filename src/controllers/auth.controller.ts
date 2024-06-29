import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services";
import { logger } from "../utils";
import { HttpError, isHttpError } from "../middlewares";

export class AuthController {
  constructor(private readonly service: AuthService) {}

  signUp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { name, email, password } = req.body;

      await this.service.signUp(name, email, password);

      logger.info(`User ${name} signed up successfully with email: ${email}`);

      res.status(201).json({ message: "User signed up successfully" });
    } catch (error) {
      const statusCode = isHttpError(error) ? error.statusCode : 500;
      const errorMessage = isHttpError(error)
        ? error.message
        : "Internal Server Error";

      next(new HttpError(errorMessage, statusCode));
    }
  };

  signIn = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, password } = req.body;

      const accesToken = await this.service.signIn(email, password);

      logger.info(`User signed in successfully with email: ${email}`);

      res.status(200).json({
        message: "Successful login",
        accesToken,
      });
    } catch (error) {
      const statusCode = isHttpError(error) ? error.statusCode : 500;
      const errorMessage = isHttpError(error)
        ? error.message
        : "Internal Server Error";

      next(new HttpError(errorMessage, statusCode));
    }
  };
}
