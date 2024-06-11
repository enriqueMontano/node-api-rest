import { Router } from "express";
import { AuthController } from "../controllers";
import { validate } from "../middlewares";
import { signUpValidationChains, signInValidationChains } from "../validations";
import { IUserRepository } from "../interfaces";
import { AuthService } from "../services";
import { userRepository } from "../configs";

const router = Router();

const repository: IUserRepository = userRepository;
const service = new AuthService(repository);
const constroller = new AuthController(service);

router.post("/sign-up", validate(signUpValidationChains), constroller.signUp);
router.post("/sign-in", validate(signInValidationChains), constroller.signIn);

export default router;
