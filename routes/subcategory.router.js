import { Router } from "express";
import {
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  getSubCategories,
  getSubCategory,
  getSubcategoryOfCategory,
} from "../services/subcategory.controler.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { isAuthorized } from "../middlewares/isAuthorized.js";
import { ImageUpload } from "../utils/multer.js";
import {
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
  getCategoryValidator,
} from "../validators/category.validator.js";
const router = Router();

router.route("/").get(isAuthenticated, isAuthorized("admin"), getSubCategories);

router
  .route("/:id")
  .post(
    isAuthenticated,
    isAuthorized("admin"),
    ImageUpload.single("cover"),
    createCategoryValidator,
    createSubCategory
  )
  .patch(
    isAuthenticated,
    isAuthorized("admin"),
    ImageUpload.single("cover"),
    updateCategoryValidator,
    updateSubCategory
  )
  .delete(
    isAuthenticated,
    isAuthorized("admin"),
    deleteCategoryValidator,
    deleteSubCategory
  )
  .get(
    isAuthenticated,
    isAuthorized("admin"),
    getCategoryValidator,
    getSubCategory
  )
  .get(isAuthenticated, isAuthorized("admin"), getSubcategoryOfCategory);

export default router;
