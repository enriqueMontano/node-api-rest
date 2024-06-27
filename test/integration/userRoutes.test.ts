import request from "supertest";
import https from "https";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { v4 as uuidV4 } from "uuid";
import server from "../../src/index";
import { authConfig, mongo, databaseType, mySql } from "../../src/configs";
import { IUser, UserRoles } from "../../src/interfaces";

jest.mock("../../src/configs", () => {
  const actualConfigs = jest.requireActual("../../src/configs");
  return {
    ...actualConfigs,
    userRepository: {
      getById: jest.fn(),
      get: jest.fn(),
      delete: jest.fn(),
    },
  };
});

const createMockUser = (userData: Partial<IUser>): IUser => {
  return {
    id: userData.id || "default_id",
    roles: userData.roles || ["user"],
    name: userData.name || "default_name",
    email: userData.email || "default_email",
    password: userData.password || "default_password",
    save: jest.fn(),
    remove: jest.fn(),
  } as unknown as IUser;
};

const agent = new https.Agent({
  key: fs.readFileSync(path.resolve(__dirname, "../../private.key")),
  cert: fs.readFileSync(path.resolve(__dirname, "../../certificate.crt")),
  rejectUnauthorized: false,
});

describe("User routes", () => {
  const testUser = createMockUser({
    id:
      databaseType === "mongo"
        ? "6655aeb1b8fe6ab6df49691a"
        : "2a4b845e-5430-4c7c-9df4-b2aa0d717550",
    roles: [UserRoles.User],
    name: "Test User",
    email: "testuser@example.com",
    password: "hashedpassword",
  });
  const testAdmin = createMockUser({
    id:
      databaseType === "mongo"
        ? "6655b251408318022ab47a9d"
        : "7cbb6a87-c9de-4129-b94e-287b784c0b9a",
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
    { expiresIn: "1ms" }
  );
  const nonExistentUserToken = jwt.sign(
    { userId: "non_existent_user_id" },
    authConfig.jwtSecret,
    { expiresIn: "1h" }
  );
  const invalidUserToken = "invalid_token";

  beforeAll(async () => {
    if (databaseType === "mongo") {
      await mongo.connectDb();
    } else {
      await mySql.connectDb();
    }
  });

  afterAll(async () => {
    if (databaseType === "mongo") {
      await mongo.disconnectDb();
    } else {
      await mySql.disconnectDb();
    }
    await new Promise<void>((resolve) => {
      server.close(() => {
        console.log("Server closed");
        resolve();
      });
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();

    require("../../src/configs").userRepository.getById.mockImplementation(
      (id: string) => {
        if (id === testUser.id) {
          return Promise.resolve(testUser);
        } else if (id === testAdmin.id) {
          return Promise.resolve(testAdmin);
        } else {
          return Promise.resolve(null);
        }
      }
    );

    require("../../src/configs").userRepository.get.mockImplementation(() =>
      Promise.resolve([testUser, testAdmin])
    );

    require("../../src/configs").userRepository.delete.mockImplementation(
      async (id: string) => {
        if (id === testUser.id || id === testAdmin.id) {
          return "User deleted successfully";
        }
        throw new Error();
      }
    );
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
    const response = await request(server)
      .delete(`/api/users/${testUser.id}`)
      .agent(agent)
      .set("Authorization", `Bearer ${adminUserToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.message).toBe("User deleted successfully");
  });

  it("should return 403 when a non-admin tries to delete a user by id", async () => {
    const response = await request(server)
      .delete(`/api/users/${testAdmin.id}`)
      .agent(agent)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Unauthorized role");
  });

  it("should return 422 when an admin user tries to delete a user by an invalid id", async () => {
    const invalidId = "invalid_id";
    const response = await request(server)
      .delete(`/api/users/${invalidId}`)
      .agent(agent)
      .set("Authorization", `Bearer ${adminUserToken}`);

    expect(response.status).toBe(422);
    expect(response.body.message).toBe("id: Invalid ID format");
  });
});
