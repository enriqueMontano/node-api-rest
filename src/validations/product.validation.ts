import { ValidationChain, body, param } from "express-validator";

export const getOneProductValidationChains: ValidationChain =
  param("id").isMongoId();

export const createProductValidationChains: ValidationChain[] = [
  body("name").isString().notEmpty(),
  body("description").isString().notEmpty(),
  body("category").isString().notEmpty(),
  body("price").isNumeric().notEmpty(),
];

export const updateOneProductValidationChains: ValidationChain[] = [
  param("id").isMongoId(),
  body("name").isString().optional(),
  body("description").isString().optional(),
  body("category").isString().optional(),
  body("price").isNumeric().optional(),
];

export const deleteOneProductValidationChains: ValidationChain =
  param("id").isMongoId();
