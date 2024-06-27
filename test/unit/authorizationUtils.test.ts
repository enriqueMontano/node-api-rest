import mongoose from "mongoose";
import { isProductOwner } from "../../src/utils";
import { HttpError } from "../../src/middlewares";

jest.mock("mongoose");

describe("isProductOwner function", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should returns true if mongo ids are valids and equals", async () => {
    const mockRequestUserId = "6654e85c8a0dd46e7d9c4fd7";
    const mockProductUserId = "6654e85c8a0dd46e7d9c4fd7";

    (mongoose.Types.ObjectId.isValid as jest.Mock)
      .mockReturnValue(true)
      .mockReturnValue(true);
    (mongoose.Types.ObjectId.prototype.equals as jest.Mock).mockReturnValue(
      true
    );

    const result = isProductOwner(mockRequestUserId, mockProductUserId);
    expect(result).toBe(true);
  });

  it("should returns false if mongo ids are valids but not equals", async () => {
    const mockRequestUserId = "6654e86525f7b984ca55657a";
    const mockProductUserId = "6654e86bcfd5479dce448075";

    (mongoose.Types.ObjectId.isValid as jest.Mock)
      .mockReturnValue(true)
      .mockReturnValue(true);
    (mongoose.Types.ObjectId.prototype.equals as jest.Mock).mockReturnValue(
      false
    );

    const result = isProductOwner(mockRequestUserId, mockProductUserId);
    expect(result).toBe(false);
  });

  it("should throw HttpError if requestUserId is an invalid mongo id", async () => {
    const mockRequestUserId = "invalid_id";
    const mockProductUserId = "6654e8ce467524b1bf5f727e";

    (mongoose.Types.ObjectId.isValid as jest.Mock)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);

    expect(() => {
      isProductOwner(mockRequestUserId, mockProductUserId);
    }).toThrow(HttpError);

    try {
      isProductOwner(mockRequestUserId, mockProductUserId);
    } catch (error) {
      expect((error as HttpError).message).toBe("Invalid Id");
      expect((error as HttpError).statusCode).toBe(400);
    }
  });

  it("should throw HttpError if productUserId is an invalid mongo id", async () => {
    const mockRequestUserId = "6654e8ce467524b1bf5f727e";
    const mockProductUserId = "invalid_id";

    (mongoose.Types.ObjectId.isValid as jest.Mock)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false);

    expect(() => {
      isProductOwner(mockRequestUserId, mockProductUserId);
    }).toThrow(HttpError);

    try {
      isProductOwner(mockRequestUserId, mockProductUserId);
    } catch (error) {
      expect((error as HttpError).message).toBe("Invalid Id");
      expect((error as HttpError).statusCode).toBe(400);
    }
  });

  it("should returns true if both UUIDs are valids and equals", async () => {
    const mockRequestUserId = "69f82092-28d8-4d99-87b8-c64a8ddbe0fd";
    const mockProductUserId = "69f82092-28d8-4d99-87b8-c64a8ddbe0fd";

    const result = isProductOwner(mockRequestUserId, mockProductUserId);
    expect(result).toBe(true);
  });

  it("should returns false if UUIDs are valids but not equals", async () => {
    const mockRequestUserId = "166e1c27-ee9e-4903-a20c-1b7b680e0156";
    const mockProductUserId = "cab1e23b-9d6c-4523-899c-fc6d53b741a8";

    const result = isProductOwner(mockRequestUserId, mockProductUserId);
    expect(result).toBe(false);
  });

  it("should throw HttpError if requestUserId is an invalid UUID", async () => {
    const mockRequestUserId = "invalid_id";
    const mockProductUserId = "cab1e23b-9d6c-4523-899c-fc6d53b741a8";

    expect(() => {
      isProductOwner(mockRequestUserId, mockProductUserId);
    }).toThrow(HttpError);

    try {
      isProductOwner(mockRequestUserId, mockProductUserId);
    } catch (error) {
      expect((error as HttpError).message).toBe("Invalid Id");
      expect((error as HttpError).statusCode).toBe(400);
    }
  });

  it("should throw HttpError if productUserId is an invalid UUID", async () => {
    const mockRequestUserId = "cab1e23b-9d6c-4523-899c-fc6d53b741a8";
    const mockProductUserId = "invalid_id";

    expect(() => {
      isProductOwner(mockRequestUserId, mockProductUserId);
    }).toThrow(HttpError);

    try {
      isProductOwner(mockRequestUserId, mockProductUserId);
    } catch (error) {
      expect((error as HttpError).message).toBe("Invalid Id");
      expect((error as HttpError).statusCode).toBe(400);
    }
  });
});
