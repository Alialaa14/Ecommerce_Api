import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../services/product.controler.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { isAuthorized } from "../middlewares/isAuthorized.js";
import { ImageUpload } from "../utils/multer.js";
import {
  createProductValidator,
  updateProductValidtor,
} from "../validators/product.validator.js";
import { parseVariant } from "../middlewares/parseToJson.js";

const router = Router({ mergeParams: true });

router
  .route("/")
  .post(
    isAuthenticated,
    isAuthorized("admin"),
    ImageUpload.array("images", 5),
    // parseVariant,
    // createProductValidator,
    createProduct
  )
  .get(isAuthenticated, isAuthorized("admin", "user"), getProducts);
router
  .route("/:id")
  .patch(
    isAuthenticated,
    isAuthorized("admin"),
    ImageUpload.array("images", 5),
    // parseVariant,
    // updateProductValidtor ,
    updateProduct
  )
  .delete(isAuthenticated, isAuthorized("admin"), deleteProduct)
  .get(isAuthenticated, isAuthorized("admin", "user"), getProduct);

export default router;
