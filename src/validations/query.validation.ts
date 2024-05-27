import { ValidationChain, query } from "express-validator";

export const queryParametersValidationChains: ValidationChain[] = [
  query("filters").isJSON().optional(),
  query("sort").isString().optional(),
  query("page").isNumeric().optional(),
  query("limit").isNumeric().optional(),
];
