import { NextFunction, Request, Response } from "express";
import { userService } from "../services";
import { HttpError, isHttpError } from "../middlewares";
import { logger } from "../utils";

export const userController = {
  getAll: async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const users = await userService.getAll();

      res.status(200).json(users);
    } catch (error) {
      const statusCode = isHttpError(error) ? error.statusCode : 500;
      const errorMessage = isHttpError(error)
        ? error.message
        : "Internal Server Error";

      next(new HttpError(errorMessage, statusCode));
    }
  },

  deleteOneById: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await userService.deleteOneById(req.params.id);

      logger.info(`User deleted`);

      res.status(200).json({
        message: "User deleted succesfully",
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
