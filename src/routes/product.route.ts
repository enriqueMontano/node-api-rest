import { Router } from "express";
import {
  authenticate,
  authorize,
  sanitizeQuery,
  validate,
} from "../middlewares";
import { productController } from "../controllers";
import { IProductRepository, UserRoles } from "../interfaces";
import {
  getOneProductValidationChains,
  createProductValidationChains,
  updateOneProductValidationChains,
  deleteOneProductValidationChains,
  queryParametersValidationChains,
} from "../validations";
import { productRepository } from "../configs";
import { ProductService } from "../services";

const router = Router();

const repository: IProductRepository = productRepository;
const service = new ProductService(repository);
const controller = new productController(service);

router.get("/", authenticate, authorize([UserRoles.Admin]), controller.get);

router.get(
  "/search",
  authenticate,
  authorize([UserRoles.Admin, UserRoles.User]),
  validate(queryParametersValidationChains),
  sanitizeQuery,
  controller.search
);

router.get(
  "/user",
  authenticate,
  authorize([UserRoles.Admin, UserRoles.User]),
  controller.getByUserId
);

router.get(
  "/:id",
  authenticate,
  authorize([UserRoles.Admin, UserRoles.User]),
  validate(getOneProductValidationChains),
  controller.getById
);

router.post(
  "/",
  authenticate,
  authorize([UserRoles.Admin, UserRoles.User]),
  validate(createProductValidationChains),
  controller.createOne
);

router.patch(
  "/:id",
  authenticate,
  authorize([UserRoles.Admin, UserRoles.User]),
  validate(updateOneProductValidationChains),
  controller.update
);

router.delete(
  "/:id",
  authenticate,
  authorize([UserRoles.Admin, UserRoles.User]),
  validate(deleteOneProductValidationChains),
  controller.delete
);

export default router;
