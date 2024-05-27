import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userService } from "../services";
import { authConfig } from "../configs";
import { logger } from "../utils";
import { HttpError, isHttpError } from "../middlewares";

export const authController = {
  signUp: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { name, email, password } = req.body;

      const emailAlreadyExists = await userService.getOneByEmail(email);
      if (emailAlreadyExists) {
        throw new HttpError("Email address already in use", 400);
      }

      // Encrypt and hash the password
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      await userService.createOne({
        name,
        email,
        password: hashedPassword,
      });

      logger.info(`User ${name} sign up successfully with email: ${email}`);

      res.status(201).json({ message: "User sign up successfully" });
    } catch (error) {
      const statusCode = isHttpError(error) ? error.statusCode : 500;
      const errorMessage = isHttpError(error)
        ? error.message
        : "Internal Server Error";

      next(new HttpError(errorMessage, statusCode));
    }
  },

  signIn: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, password } = req.body;

      const user = await userService.getOneByEmail(email);
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

      logger.info(
        `User ${user.name} sign up successfully with email: ${email}`
      );

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
  },
};
