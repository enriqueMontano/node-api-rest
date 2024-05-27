import { Request, Response, NextFunction } from "express";
import { HttpError } from "./errorHandler.middleware";

export const sanitizeQuery = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const query: any = {};
    const filters = req.query.filters
      ? JSON.parse(req.query.filters as string)
      : {};

    for (let key in filters) {
      const value = filters[key];
      if (typeof value === "string") {
        query[key] = { $regex: value, $options: "i" };
      } else {
        query[key] = value;
      }
    }

    const sort = req.query.sort ? (req.query.sort as string) : undefined;
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const skip = (page - 1) * limit;

    if (page < 1 || limit < 1) {
      return next(new HttpError("Page and limit must be greater than 0", 422));
    }

    req.queryOptions = { query, sort, skip, limit };
    next();
  } catch (error) {
    next(new HttpError("Invalid query parameters", 400));
  }
};
