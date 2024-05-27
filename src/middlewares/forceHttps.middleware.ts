import { Request, Response, NextFunction } from "express";

export const forceHttps = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.secure || req.headers["x-forwarded-proto"] === "https") {
    next();
  } else {
    res.status(403).send("HTTPS Required");
  }
};
