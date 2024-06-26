import express, { Application } from "express";
import https from "https";
import fs from "fs";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import router from "./routes";
import { errorHandler, morganMiddleware, forceHttps } from "./middlewares";
import { logger } from "./utils";
import { appConfig, mongo, mySql, databaseType } from "./configs";

if (databaseType === "mongo") {
  mongo.connectDb();
} else {
  mySql.connectDb();
}

const app: Application = express();

app.use(forceHttps);
app.use(morganMiddleware);
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(helmet());
app.use(express.json());

app.use("/api", router);
app.use(errorHandler);

// Private key and SSL certificate
const options = {
  key: fs.readFileSync(path.resolve(__dirname, "../private.key")),
  cert: fs.readFileSync(path.resolve(__dirname, "../certificate.crt")),
};

const server = https.createServer(options, app);

server.listen(appConfig.port, () => {
  logger.info(`HTTPS Server listening at port: ${appConfig.port}`);
});

export default server;
