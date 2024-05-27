import { Router } from "express";
import { authController } from "../controllers";
import { validate } from "../middlewares";
import { signUpValidationChains, signInValidationChains } from "../validations";

const router = Router();

router.post(
  "/sign-up",
  validate(signUpValidationChains),
  authController.signUp
);

router.post(
  "/sign-in",
  validate(signInValidationChains),
  authController.signIn
);

export default router;
