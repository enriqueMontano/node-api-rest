import { Request, Response, NextFunction } from "express";
import mongoose, { ObjectId } from "mongoose";
import { productService } from "../services";
import { HttpError, isHttpError } from "../middlewares";
import { isProductOwner, logger } from "../utils";
import { UserRoles } from "../interfaces";

export const productController = {
  getAll: async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const products = await productService.getAll();

      res.status(200).json(products);
    } catch (error) {
      const statusCode = isHttpError(error) ? error.statusCode : 500;
      const errorMessage = isHttpError(error)
        ? error.message
        : "Internal Server Error";

      next(new HttpError(errorMessage, statusCode));
    }
  },

  search: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await productService.search(req.queryOptions);
      if (!result) {
        throw new HttpError("Products not found", 404);
      }

      res.status(200).json(result);
    } catch (error) {
      const statusCode = isHttpError(error) ? error.statusCode : 500;
      const errorMessage = isHttpError(error)
        ? error.message
        : "Internal Server Error";

      next(new HttpError(errorMessage, statusCode));
    }
  },

  getByUser: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const products = await productService.getByUser(req.user.id);

      res.status(200).json(products);
    } catch (error) {
      const statusCode = isHttpError(error) ? error.statusCode : 500;
      const errorMessage = isHttpError(error)
        ? error.message
        : "Internal Server Error";

      next(new HttpError(errorMessage, statusCode));
    }
  },

  getOneById: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const product = await productService.getOneById(req.params.id);

      res.status(200).json(product);
    } catch (error) {
      const statusCode = isHttpError(error) ? error.statusCode : 500;
      const errorMessage = isHttpError(error)
        ? error.message
        : "Internal Server Error";

      next(new HttpError(errorMessage, statusCode));
    }
  },

  createOne: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const newProduct = await productService.createOne({
        user: req.user.id,
        ...req.body,
      });

      logger.info("Product created successfully");

      res.status(201).json(newProduct);
    } catch (error) {
      const statusCode = isHttpError(error) ? error.statusCode : 500;
      const errorMessage = isHttpError(error)
        ? error.message
        : "Internal Server Error";

      next(new HttpError(errorMessage, statusCode));
    }
  },

  updateOneById: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const product = await productService.getOneById(req.params.id);
      if (!product) {
        throw new HttpError("Product not found", 404);
      }

      const userId = req.user.id as string;
      let productUserId: string | ObjectId;
      if (product.user instanceof mongoose.Types.ObjectId) {
        productUserId = product.user.toHexString();
      } else {
        productUserId = product.user as unknown as string;
      }

      const isOwner = isProductOwner(userId, productUserId);
      const isAdmin = req.user.roles.includes(UserRoles.Admin);
      if (!isAdmin && !isOwner) {
        throw new HttpError("Forbidden", 403);
      }

      const updatedProduct = await productService.updateOneById(
        req.params.id,
        req.body
      );

      logger.info("Product updated successfully");

      res.status(200).json(updatedProduct);
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
      const product = await productService.getOneById(req.params.id);
      if (!product) {
        throw new HttpError("Product not found", 404);
      }

      const userId = req.user.id as string;
      let productUserId: string | ObjectId;
      if (product.user instanceof mongoose.Types.ObjectId) {
        productUserId = product.user.toHexString();
      } else {
        productUserId = product.user as unknown as string;
      }

      const isOwner = isProductOwner(userId, productUserId);
      const isAdmin = req.user.roles.includes(UserRoles.Admin);
      if (!isAdmin && !isOwner) {
        throw new HttpError("Forbidden", 403);
      }

      await productService.deleteOneById(req.params.id);

      logger.info("Product deleted successfully");

      res.status(200).json("Product deleted successfully");
    } catch (error) {
      const statusCode = isHttpError(error) ? error.statusCode : 500;
      const errorMessage = isHttpError(error)
        ? error.message
        : "Internal Server Error";

      next(new HttpError(errorMessage, statusCode));
    }
  },
};
