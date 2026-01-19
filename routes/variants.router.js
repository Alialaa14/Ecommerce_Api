import { Router } from "express";
import {
  getVariant,
  updateVariant,
  variantsOfProduct,
  deleteVariant,
  addImage,
  deleteImage,
} from "../services/variants.controler.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { isAuthorized } from "../middlewares/isAuthorized.js";
import { ImageUpload } from "../utils/multer.js";

// GET ALL VARIANTS OF A PRODUCT
// GET CERTIAN VARIANT
// UPDATE CERTIAN VARIANT
// DELETE CERTIAN VARIANT

const router = Router({ mergeParams: true });

router
  .route("/")
  .get(isAuthenticated, isAuthorized("admin"), variantsOfProduct);
router
  .route("/:variantId")
  .get(isAuthenticated, isAuthorized("admin"), getVariant)
  .patch(isAuthenticated, isAuthorized("admin"), updateVariant)
  .delete(isAuthenticated, isAuthorized("admin"), deleteVariant);

router
  .route("/:variantId/image")
  .post(
    isAuthenticated,
    isAuthorized("admin"),
    ImageUpload.array("images", 5),
    addImage
  )
  .delete(isAuthenticated, isAuthorized("admin"), deleteImage);

export default router;
