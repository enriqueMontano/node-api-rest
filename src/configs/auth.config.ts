import dotenv from "dotenv";

dotenv.config();

export const authConfig = {
  jwtSecret: process.env.JWT_SECRET || "default_secret",
  jwtExpiration: process.env.JWT_EXPIRATION || "1h",
};
