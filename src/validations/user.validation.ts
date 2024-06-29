import { param, ValidationChain } from "express-validator";
import { isMongoId, isUUID } from "validator";

export const deleteOneUserValidationChains: ValidationChain = param(
  "id"
).custom((value) => {
  if (!isMongoId(value) && !isUUID(value)) {
    throw new Error("Invalid ID format");
  }
  return true;
});
