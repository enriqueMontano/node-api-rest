import mongoose from "mongoose";
import dotenv from "dotenv";
import { logger } from "../utils";
import { Sequelize } from "sequelize-typescript";
import { User, Product } from "../models/mysql";

dotenv.config();

const databaseType = process.env.DATABASE_TYPE as string;

// Mongo db connection
const mongoDbUri = (process.env.MONGO_URI as string) || "mongodb://127.0.0.1/";
const mongoDbName = (process.env.MONGO_DB_NAME as string) || "test";
const mongo = {
  connectDb: async (): Promise<void> => {
    try {
      await mongoose.connect(mongoDbUri + mongoDbName);
      logger.info("MongoDB connected successfully");
    } catch (error) {
      logger.error(`MongoDB connection error: ${error}`);
      process.exit(1);
    }
  },

  disconnectDb: async (): Promise<void> => {
    try {
      await mongoose.disconnect();
      logger.info("MongoDB disconnected successfully");
    } catch (error) {
      logger.error(`MongoDB disconnection error: ${error}`);
      process.exit(1);
    }
  },
};

// MySQL db connection
const sequelize = new Sequelize({
  dialect: "mysql",
  host: (process.env.MYSQL_URI as string) || "localhost",
  port: Number(process.env.MYSQL_PORT) || 3306,
  username: (process.env.MYSQL_USER as string) || "root",
  password: (process.env.MYSQL_PASSWORD as string) || "",
  database: (process.env.MYSQL_DB_NAME as string) || "",
  models: [User, Product],
});
const mySql = {
  connectDb: async (): Promise<void> => {
    try {
      await sequelize.authenticate();
      logger.info("MySQL connected successfully");
    } catch (error) {
      logger.error(`MySQL connection error: ${error}`);
      process.exit(1);
    }
  },

  disconnectDb: async (): Promise<void> => {
    try {
      await sequelize.close();
      logger.info("MySQL disconnected successfully");
    } catch (error) {
      logger.error(`MySQL disconnection error: ${error}`);
    }
  },
};

export { mongo, mySql, sequelize, databaseType };
