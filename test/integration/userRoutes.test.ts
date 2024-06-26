import request from "supertest";
import https from "https";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import mongoose, { Document } from "mongoose";
import server from "../../src/index";
import { authConfig, mongo } from "../../src/configs";
import { IUser, IUserRepository, UserRoles } from "../../src/interfaces";
import { mongoUserRepository } from "../../src/repositories";

jest.mock("../../src/repositories");

const repository: IUserRepository = mongoUserRepository;

const createMockUser = (userData: Partial<IUser>): IUser & Document => {
  return {
    ...userData,
    _id: new mongoose.Types.ObjectId(),
    isNew: false,
    save: jest.fn(),
    remove: jest.fn(),
  } as unknown as IUser & Document;
};

const agent = new https.Agent({
  key: fs.readFileSync(path.resolve(__dirname, "../../private.key")),
  cert: fs.readFileSync(path.resolve(__dirname, "../../certificate.crt")),
  rejectUnauthorized: false,
});

describe("User routes", () => {
  const testUser = createMockUser({
    id: "6655aeb1b8fe6ab6df49691a",
    roles: [UserRoles.User],
    name: "Test User",
    email: "testuser@example.com",
    password: "hashedpassword",
  });

  const testAdmin = createMockUser({
    id: "6655b251408318022ab47a9d",
    roles: [UserRoles.Admin],
    name: "Test Admin",
    email: "testadmin@example.com",
    password: "hashedpassword",
  });

  const userToken = jwt.sign({ userId: testUser.id }, authConfig.jwtSecret);
  const adminUserToken = jwt.sign(
    { userId: testAdmin.id },
    authConfig.jwtSecret
  );
  const expiredUserToken = jwt.sign(
    { userId: testUser.id },
    authConfig.jwtSecret,
    {
      expiresIn: "1ms",
    }
  );
  const nonExistentUserToken = jwt.sign(
    { userId: "non_existent_user_id" },
    authConfig.jwtSecret,
    { expiresIn: "1h" }
  );
  const invalidUserToken = "invalid_token";

  beforeAll(async () => {
    await mongo.connectDb();
  });
  afterAll(async () => {
    await mongo.disconnectDb();
    await new Promise<void>((resolve) => {
      server.close(() => {
        console.log("Server closed");
        resolve();
      });
    });
  });
  beforeEach(() => {
    repository.getById = jest.fn((id: string) => {
      console.log("id: ", id);
      if (id === testUser.id) {
        console.log("user", testUser.id);
        return Promise.resolve(testUser);
      } else if (id === testAdmin.id) {
        console.log("admin", testAdmin);

        return Promise.resolve(testAdmin);
      } else {
        console.log("null");
        return Promise.resolve(null);
      }
    });
  });

  it("should get all users with valid token and admin user", async () => {
    const response = await request(server)
      .get("/api/users")
      .agent(agent)
      .set("Authorization", `Bearer ${adminUserToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  it("should return 404 when tries to get all users without token", async () => {
    const response = await request(server).get("/api/users").agent(agent);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Token not found");
  });

  it("should return 404 when tries to get all users with a user that not exists in the database", async () => {
    const response = await request(server)
      .get("/api/users")
      .agent(agent)
      .set("Authorization", `Bearer ${nonExistentUserToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
  });

  it("should return 401 when tries to get all users with an expired token", async () => {
    const response = await request(server)
      .get("/api/users")
      .agent(agent)
      .set("Authorization", `Bearer ${expiredUserToken}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Token expired");
  });

  it("should return 401 when tries to get all users with an invalid token", async () => {
    const response = await request(server)
      .get("/api/users")
      .agent(agent)
      .set("Authorization", `Bearer ${invalidUserToken}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid token");
  });

  it("should return 403 when a non-admin tries to get all users", async () => {
    const response = await request(server)
      .get("/api/users")
      .agent(agent)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Unauthorized role");
  });

  it("should delete a user by id", async () => {
    const userId = "6655b98a747268fd8b69cabc";
    const response = await request(server)
      .delete(`/api/users/${userId}`)
      .agent(agent)
      .set("Authorization", `Bearer ${adminUserToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.message).toBe("User deleted succesfully");
  });

  it("should return 403 when a non-admin tries to delete a user by id", async () => {
    const userId = "6655b9d817c7af0c7a2cfc9b";
    const response = await request(server)
      .delete(`/api/users/${userId}`)
      .agent(agent)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Unauthorized role");
  });

  it("should return 422 when an admin user tries to delete a user by an invalid mongo id", async () => {
    const invalidMongoId = "invalid_mongo_id";
    const response = await request(server)
      .delete(`/api/users/${invalidMongoId}`)
      .agent(agent)
      .set("Authorization", `Bearer ${adminUserToken}`);

    expect(response.status).toBe(422);
    expect(response.body.message).toBe("id: Invalid value");
  });
});
