import { Request, Response, NextFunction } from "express";
import {
  validationResult,
  ValidationChain,
  ValidationError,
  checkExact,
} from "express-validator";
import { HttpError } from "./errorHandler.middleware";

export const validate =
  (validationChains: ValidationChain | ValidationChain[]) =>
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const chains = Array.isArray(validationChains)
      ? validationChains
      : [validationChains];

    await Promise.all(chains.map((chain) => checkExact(chain).run(req)));

    const result = validationResult(req).formatWith(
      (error: ValidationError) => {
        switch (error.type) {
          case "field":
            return `${error.path}: ${error.msg}`;

          case "alternative":
            return error.nestedErrors
              .map((nestedError) => `${nestedError.path}: ${nestedError.msg}`)
              .join("\r\n");

          case "alternative_grouped":
            return error.nestedErrors
              .map((nestedErrors) =>
                nestedErrors
                  .map(
                    (nestedError) => `${nestedError.path}: ${nestedError.msg}`
                  )
                  .join("\r\n")
              )
              .join("\r\n");

          case "unknown_fields":
            return `${error.msg}`;

          default:
            return `Unknown error type`;
        }
      }
    );

    if (!result.isEmpty()) {
      const firstErrorMessage = result.array()[0];
      return next(new HttpError(firstErrorMessage, 422));
    }

    next();
  };
