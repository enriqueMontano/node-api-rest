import mongoose from "mongoose";
import dotenv from "dotenv";
import { Dialect } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { logger } from "../utils";
import { User, Product } from "../models/sql";
import { DatabaseType } from "../interfaces";

dotenv.config();

const databaseType =
  (process.env.DB_TYPE as DatabaseType) || DatabaseType.MySQL;

// Mongo db connection
const mongoDbUri = (process.env.DB_URI as string) || "mongodb://127.0.0.1/";
const mongoDbName = (process.env.DB_NAME as string) || "test";
const mongoDb = {
  connect: async (): Promise<void> => {
    try {
      await mongoose.connect(mongoDbUri + mongoDbName);
      logger.info("MongoDB connected successfully");
    } catch (error) {
      logger.error(`MongoDB connection error: ${error}`);
      process.exit(1);
    }
  },

  disconnect: async (): Promise<void> => {
    try {
      await mongoose.disconnect();
      logger.info("MongoDB disconnected successfully");
    } catch (error) {
      logger.error(`MongoDB disconnection error: ${error}`);
      process.exit(1);
    }
  },
};

// Sequelize db connection
let sequelize: Sequelize | null = null;
if (databaseType !== DatabaseType.MongoDB) {
  sequelize = new Sequelize({
    dialect: databaseType as Dialect,
    host: process.env.DB_URI || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "test",
    models: [User, Product],
    logging: (msg) => logger.debug(msg),
  });
}

const sequelizeOrm = {
  connectDb: async (): Promise<void> => {
    if (sequelize) {
      try {
        await sequelize.authenticate();
        logger.info(`${databaseType} db connected successfully`);
      } catch (error) {
        logger.error(`${databaseType} db connection error: ${error}`);
        process.exit(1);
      }
    } else {
      logger.warn("No Sequelize instance initialized for current DB_TYPE");
    }
  },

  disconnectDb: async (): Promise<void> => {
    if (sequelize) {
      try {
        await sequelize.close();
        logger.info(`${databaseType} db disconnected successfully`);
      } catch (error) {
        logger.error(`${databaseType} db disconnection error: ${error}`);
      }
    }
  },

  syncDb: async (force: boolean): Promise<void> => {
    if (sequelize) {
      try {
        await sequelize.sync({ force });
        logger.info("All models were synchronized successfully");
      } catch (error) {
        logger.error(`Sync error: ${error}`);
        process.exit(1);
      }
    }
  },
};

export { mongoDb, sequelizeOrm, databaseType };
