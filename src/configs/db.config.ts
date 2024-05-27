import mongoose from "mongoose";
import dotenv from "dotenv";
import { logger } from "../utils";

dotenv.config();

const dbUri = (process.env.MONGO_URI as string) || "mongodb://127.0.0.1/";
const dbName = (process.env.MONGO_DB_NAME as string) || "test";

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(dbUri + dbName);
    logger.info("MongoDB connected successfully");
  } catch (error) {
    logger.error(`MongoDB connected successfully ${error}`);
    process.exit(1);
  }
};
