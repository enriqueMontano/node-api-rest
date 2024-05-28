import dotenv from "dotenv";

dotenv.config();

export const appConfig = {
  port: process.env.HTTPS_PORT || 8443,
  nodeEnv: process.env.NODE_ENV || "development",
};
