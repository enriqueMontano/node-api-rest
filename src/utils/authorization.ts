import mongoose, { ObjectId } from "mongoose";
import { HttpError } from "../middlewares";

export const isProductOwner = async (
  requestUserId: string,
  productUserId: string | ObjectId
): Promise<boolean> => {
  if (
    !mongoose.Types.ObjectId.isValid(requestUserId) ||
    !mongoose.Types.ObjectId.isValid(productUserId as string)
  ) {
    throw new HttpError("Invalid mongo id", 400);
  }

  const objectId1 = new mongoose.Types.ObjectId(requestUserId);
  const objectId2 = new mongoose.Types.ObjectId(productUserId as string);
  const areEqual = objectId1.equals(objectId2);

  return areEqual;
};
