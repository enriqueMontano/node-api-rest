import { Request, Response, NextFunction } from "express";
import { logger } from "../utils";

class HttpError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const isHttpError = (error: unknown): error is HttpError => {
  return error instanceof Error && "statusCode" in error;
};

const errorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  logger.error(
    `${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
  );

  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
  });
};

export { HttpError, errorHandler };
