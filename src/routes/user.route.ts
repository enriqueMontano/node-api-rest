import { Router } from "express";
import { IUserRepository, UserRoles } from "../interfaces";
import { authenticate, authorize, validate } from "../middlewares";
import { deleteOneUserValidationChains } from "../validations";
import { UserService } from "../services";
import { UserController } from "../controllers";
import { userRepository } from "../configs";

const router = Router();

const repository: IUserRepository = userRepository;
const service = new UserService(repository);
const constroller = new UserController(service);

router.get("/", authenticate, authorize([UserRoles.Admin]), constroller.get);

router.delete(
  "/:id",
  authenticate,
  authorize([UserRoles.Admin]),
  validate(deleteOneUserValidationChains),
  constroller.deleteUser
);

export default router;
