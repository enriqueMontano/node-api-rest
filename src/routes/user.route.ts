import { Router } from "express";
import { authenticate, authorize, validate } from "../middlewares";
import { userController } from "../controllers";
import { UserRoles } from "../interfaces";
import { deleteOneUserValidationChains } from "../validations";

const router = Router();

router.get(
  "/",
  authenticate,
  authorize([UserRoles.Admin]),
  userController.getAll
);

router.delete(
  "/:id",
  authenticate,
  authorize([UserRoles.Admin]),
  validate(deleteOneUserValidationChains),
  userController.deleteOneById
);

export default router;
