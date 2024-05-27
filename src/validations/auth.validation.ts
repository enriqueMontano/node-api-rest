import { body, ValidationChain } from "express-validator";

export const signUpValidationChains: ValidationChain[] = [
  body("name").isString().notEmpty(),
  body("email").isEmail().notEmpty(),
  body("password").isString().notEmpty().withMessage("Cannot be empty"),
];

export const signInValidationChains: ValidationChain[] = [
  body("email").isEmail().notEmpty(),
  body("password").isString().notEmpty(),
];
