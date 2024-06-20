import mongoose from "mongoose";
import dotenv from "dotenv";
import { logger } from "../utils";
import mysql, { Connection, MysqlError } from "mysql";

dotenv.config();

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
const dbConfig = {
  host: process.env.MYSQL_URI || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB_NAME,
};

let connection: Connection;

const handleDisconnect = () => {
  connection = mysql.createConnection(dbConfig);

  connection.connect((error: MysqlError) => {
    if (error) {
      logger.error(`MySQL connection error: ${error.stack}`);
      setTimeout(handleDisconnect, 2000);
    } else {
      logger.info(
        `MySQL connected successfully with id: ${connection.threadId}`
      );
    }
  });

  connection.on("error", (error: MysqlError) => {
    if (error.code === "PROTOCOL_CONNECTION_LOST") {
      logger.warn("MySQL connection lost. Reconnecting...");
      handleDisconnect();
    } else {
      throw error;
    }
  });
};

const mySql = {
  connectDb: async (): Promise<void> => {
    try {
      handleDisconnect();
    } catch (error) {
      logger.error(`MySQL connection error: ${error}`);
      process.exit(1);
    }
  },

  disconnectDb: async (): Promise<void> => {
    try {
      connection.end((error: MysqlError | undefined) => {
        if (error) {
          logger.error(`MySQL disconnection error: ${error.stack}`);
        } else {
          logger.info("MySQL disconnected successfully");
        }
      });
    } catch (error) {
      logger.error(`MySQL disconnection error: ${error}`);
    }
  },
};

export { mongo, mySql };
