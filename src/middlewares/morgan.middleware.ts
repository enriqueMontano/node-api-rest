import morgan, { StreamOptions } from "morgan";
import { logger } from "../utils";
import { appConfig } from "../configs";

const stream: StreamOptions = {
  write: (message) => logger.http(message.trim()),
};

const skip = (): boolean => {
  const env = appConfig.nodeEnv;
  return env !== "development";
};

export const morganMiddleware = morgan(
  ":method :url :status :res[content-length] - :response-time ms",

  { stream, skip }
);
