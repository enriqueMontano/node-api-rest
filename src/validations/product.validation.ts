import { ValidationChain, body, param } from "express-validator";
import { isUUID, isMongoId } from "validator";

export const getOneProductValidationChains: ValidationChain = param(
  "id"
).custom((value) => {
  if (!isMongoId(value) && !isUUID(value)) {
    throw new Error("Invalid ID format");
  }
  return true;
});

export const createProductValidationChains: ValidationChain[] = [
  body("name").isString().notEmpty(),
  body("description").isString().notEmpty(),
  body("category").isString().notEmpty(),
  body("price").isNumeric().notEmpty(),
];

export const updateOneProductValidationChains: ValidationChain[] = [
  param("id").custom((value) => {
    if (!isMongoId(value) && !isUUID(value)) {
      throw new Error("Invalid ID format");
    }
    return true;
  }),
  body("name").isString().optional(),
  body("description").isString().optional(),
  body("category").isString().optional(),
  body("price").isNumeric().optional(),
];

export const deleteOneProductValidationChains: ValidationChain = param(
  "id"
).custom((value) => {
  if (!isMongoId(value) && !isUUID(value)) {
    throw new Error("Invalid ID format");
  }
  return true;
});
