import { check } from "express-validator";
import { validatorMiddleware } from "../middlewares/validationMiddleware.js";

export const createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 letters")
    .isLength({ max: 20 })
    .withMessage("Title must be under 20 letters"),
  check("quote")
    .notEmpty()
    .withMessage("Quote is required")
    .isLength({ min: 3 })
    .withMessage("Quote must be at least 3 letters")
    .isLength({ max: 20 })
    .withMessage("Quote must be under 20 letters"),
  validatorMiddleware,
];

export const updateCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("Id is required")
    .isMongoId()
    .withMessage("Invalid Id"),
  check("name")
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 letters")
    .isLength({ max: 20 })
    .withMessage("Title must be under 20 letters"),
  check("quote")
    .notEmpty()
    .withMessage("Quote is required")
    .isLength({ min: 3 })
    .withMessage("Quote must be at least 3 letters")
    .isLength({ max: 20 })
    .withMessage("Quote must be under 20 letters"),
  validatorMiddleware,
];

export const deleteCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("Id is required")
    .isMongoId()
    .withMessage("Invalid Id"),
  validatorMiddleware,
];

export const getCategoryValidator = [
  check("id")
    .notEmpty()
    .withMessage("Id is required")
    .isMongoId()
    .withMessage("Invalid Id"),
  validatorMiddleware,
];
