import { NextFunction, Request, Response } from "express";
import { UserService } from "../services";
import { HttpError, isHttpError } from "../middlewares";
import { logger } from "../utils";

export class UserController {
  constructor(private service: UserService) {}

  get = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const users = await this.service.get();

      res.status(200).json(users);
    } catch (error) {
      const statusCode = isHttpError(error) ? error.statusCode : 500;
      const errorMessage = isHttpError(error)
        ? error.message
        : "Internal Server Error";

      next(new HttpError(errorMessage, statusCode));
    }
  };

  deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await this.service.deleteUser(req.params.id);

      logger.info(`User deleted`);

      res.status(200).json({
        message: "User deleted successfully",
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
