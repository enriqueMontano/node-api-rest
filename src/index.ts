import express, { Application } from "express";
import https from "https";
import fs from "fs";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import router from "./routes";
import { errorHandler, morganMiddleware, forceHttps } from "./middlewares";
import { logger } from "./utils";
import { appConfig, connectDB } from "./configs";

connectDB();
const app: Application = express();

app.use(morganMiddleware);
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(forceHttps);

app.use("/api", router);
app.use(errorHandler);

// Private key and SSL certificate
const options = {
  key: fs.readFileSync(path.resolve(__dirname, "../private.key")),
  cert: fs.readFileSync(path.resolve(__dirname, "../certificate.crt")),
};

https.createServer(options, app).listen(appConfig.port, () => {
  logger.info(`Server listening at port: ${appConfig.port}`);
});

export default app;
