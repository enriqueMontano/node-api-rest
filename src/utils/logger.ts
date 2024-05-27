import { createLogger, transports, format, addColors } from "winston";
import { appConfig } from "../configs";

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },
  colors: {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "blue",
  },
};

addColors(customLevels.colors);

const environment = appConfig.nodeEnv;
let level = "info";
if (environment === "development") {
  level = "debug";
} else if (environment === "production") {
  level = "warn";
}

export const logger = createLogger({
  levels: customLevels.levels,
  level: "http",
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/all.log" }),
  ],
});
