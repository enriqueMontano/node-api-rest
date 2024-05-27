import { Router } from "express";
import {
  authenticate,
  authorize,
  sanitizeQuery,
  validate,
} from "../middlewares";
import { productController } from "../controllers";
import { UserRoles } from "../interfaces";
import {
  getOneProductValidationChains,
  createProductValidationChains,
  updateOneProductValidationChains,
  deleteOneProductValidationChains,
  queryParametersValidationChains,
} from "../validations";

const router = Router();

router.get(
  "/",
  authenticate,
  authorize([UserRoles.Admin]),
  productController.getAll
);

router.get(
  "/search",
  authenticate,
  authorize([UserRoles.Admin, UserRoles.User]),
  validate(queryParametersValidationChains),
  sanitizeQuery,
  productController.search
);

router.get(
  "/user",
  authenticate,
  authorize([UserRoles.Admin, UserRoles.User]),
  productController.getByUser
);

router.get(
  "/:id",
  authenticate,
  authorize([UserRoles.Admin, UserRoles.User]),
  validate(getOneProductValidationChains),
  productController.getOneById
);

router.post(
  "/",
  authenticate,
  authorize([UserRoles.Admin, UserRoles.User]),
  validate(createProductValidationChains),
  productController.createOne
);

router.patch(
  "/:id",
  authenticate,
  authorize([UserRoles.Admin, UserRoles.User]),
  validate(updateOneProductValidationChains),
  productController.updateOneById
);

router.delete(
  "/:id",
  authenticate,
  authorize([UserRoles.Admin, UserRoles.User]),
  validate(deleteOneProductValidationChains),
  productController.deleteOneById
);

export default router;
