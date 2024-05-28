import mongoose from "mongoose";
import { isProductOwner } from "../../src/utils";
import { HttpError } from "../../src/middlewares";

jest.mock("mongoose");

describe("isProductOwner function", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should returns true if ids are valids and equals", async () => {
    const mockRequestUserId = "6654e85c8a0dd46e7d9c4fd7";
    const mockProductUserId = "6654e85c8a0dd46e7d9c4fd7";

    (mongoose.Types.ObjectId.isValid as jest.Mock)
      .mockReturnValue(true)
      .mockReturnValue(true);
    (mongoose.Types.ObjectId.prototype.equals as jest.Mock).mockReturnValue(
      true
    );

    const result = await isProductOwner(mockRequestUserId, mockProductUserId);
    expect(result).toBe(true);
  });

  it("should returns false if ids are valids but not equals", async () => {
    const mockRequestUserId = "6654e86525f7b984ca55657a";
    const mockProductUserId = "6654e86bcfd5479dce448075";

    (mongoose.Types.ObjectId.isValid as jest.Mock)
      .mockReturnValue(true)
      .mockReturnValue(true);
    (mongoose.Types.ObjectId.prototype.equals as jest.Mock).mockReturnValue(
      false
    );

    const result = await isProductOwner(mockRequestUserId, mockProductUserId);
    expect(result).toBe(false);
  });

  it("should throw HttpError if requestUserId is an invalid mongo id", async () => {
    const mockRequestUserId = "invalid_id";
    const mockProductUserId = "6654e8ce467524b1bf5f727e";

    (mongoose.Types.ObjectId.isValid as jest.Mock)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);

    await expect(
      isProductOwner(mockRequestUserId, mockProductUserId)
    ).rejects.toThrow(HttpError);
  });

  it("should throw HttpError if productUserId is an invalid mongo id", async () => {
    const mockRequestUserId = "6654e8ce467524b1bf5f727e";
    const mockProductUserId = "invalid_id";

    (mongoose.Types.ObjectId.isValid as jest.Mock)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false);

    await expect(
      isProductOwner(mockRequestUserId, mockProductUserId)
    ).rejects.toThrow(HttpError);
  });
});
