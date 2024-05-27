import { Router, Request, Response, NextFunction } from "express";
import userRouter from "./user.route";
import productRouter from "./product.route";
import authRouter from "./auth.route";

const router = Router();

router.use(
  "/status",
  (_req: Request, res: Response, _next: NextFunction): void => {
    res.status(200).json({
      status: "OK",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  }
);

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/products", productRouter);

export default router;
