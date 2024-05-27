import { param, ValidationChain } from "express-validator";

export const deleteOneUserValidationChains: ValidationChain =
  param("id").isMongoId();
