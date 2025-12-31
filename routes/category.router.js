import { Router } from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { isAuthorized } from "../middlewares/isAuthorized.js";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "../services/category.controler.js";
import { ImageUpload } from "../utils/multer.js";
import {
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
  getCategoryValidator,
} from "../validators/category.validator.js";

const router = Router();

router
  .route("/")
  .post(
    isAuthenticated,
    isAuthorized("admin"),
    ImageUpload.single("cover"),
    createCategoryValidator,
    createCategory
  )
  .get(isAuthenticated, isAuthorized("admin"), getCategories);

router
  .route("/:id")
  .patch(
    isAuthenticated,
    isAuthorized("admin"),
    ImageUpload.single("cover"),
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    isAuthenticated,
    isAuthorized("admin"),
    deleteCategoryValidator,
    deleteCategory
  )
  .get(
    isAuthenticated,
    isAuthorized("admin"),
    getCategoryValidator,
    getCategory
  );

export default router;
