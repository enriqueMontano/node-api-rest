import mongoose, { ObjectId } from "mongoose";
import { HttpError } from "../middlewares";
import { UUID } from "crypto";
import { isMongoId, isUUID } from "validator";

export const isProductOwner = (
  requestUserId: string,
  productUserId: string | ObjectId | UUID
): boolean => {
  const isValidMongoId = (id: string): boolean => isMongoId(id);
  const isValidUUID = (id: string): boolean => isUUID(id);

  if (
    isValidMongoId(requestUserId) &&
    isValidMongoId(productUserId as string)
  ) {
    const objectId1 = new mongoose.Types.ObjectId(requestUserId);
    const objectId2 = new mongoose.Types.ObjectId(productUserId as string);
    return objectId1.equals(objectId2);
  } else if (
    isValidUUID(requestUserId) &&
    isValidUUID(productUserId as string)
  ) {
    return requestUserId === productUserId;
  } else {
    throw new HttpError("Invalid Id", 400);
  }
};
