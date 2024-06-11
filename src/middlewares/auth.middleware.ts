import { Request, Response, NextFunction } from "express";
import jwt, {
  JwtPayload,
  JsonWebTokenError,
  TokenExpiredError,
} from "jsonwebtoken";
import { HttpError, isHttpError } from "../middlewares";
import { authConfig, userRepository } from "../configs";
import { IUserRepository, UserRoles } from "../interfaces";

const repository: IUserRepository = userRepository;

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return next(new HttpError("Token not found", 404));
  }

  try {
    const decodedToken = jwt.verify(
      token,
      authConfig.jwtSecret as string
    ) as JwtPayload;

    const user = await repository.getById(decodedToken.userId);
    if (!user) {
      return next(new HttpError("User not found", 404));
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return next(new HttpError("Token expired", 401));
    }

    if (error instanceof JsonWebTokenError) {
      return next(new HttpError("Invalid token", 401));
    }

    const statusCode = isHttpError(error) ? error.statusCode : 500;
    const errorMessage = isHttpError(error)
      ? error.message
      : "Internal Server Error";

    next(new HttpError(errorMessage, statusCode));
  }
};

export const authorize =
  (roles: UserRoles[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!roles.some((role: UserRoles) => req.user?.roles.includes(role))) {
      return next(new HttpError("Unauthorized role", 403));
    }

    next();
  };
