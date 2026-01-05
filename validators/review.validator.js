import { check } from "express-validator";
import { validatorMiddleware } from "../middlewares/validationMiddleware.js";
export const createReviewValidator = [
  check("productId")
    .notEmpty()
    .withMessage("Product Id is required")
    .isMongoId()
    .withMessage("Invalid Product Id"),
  check("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isNumeric()
    .withMessage("Invalid Rating"),
  check("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 letters")
    .isLength({ max: 20 })
    .withMessage("Title must be under 20 letters"),
  check("content")
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 3 })
    .withMessage("Content must be at least 3 letters")
    .isLength({ max: 100 })
    .withMessage("Content must be under 100 letters"),
  validatorMiddleware,
];

export const updateReviewValidator = [
  check("reviewId")
    .notEmpty()
    .withMessage("Id is required")
    .isMongoId()
    .withMessage("Invalid Id"),
  check("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isNumeric()
    .withMessage("Invalid Rating"),
  check("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 letters")
    .isLength({ max: 20 })
    .withMessage("Title must be under 20 letters"),
  check("content").notEmpty().withMessage("Content is required"),
  validatorMiddleware,
];

export const deleteReviewValidator = [
  check("reviewId")
    .notEmpty()
    .withMessage("Id is required")
    .isMongoId()
    .withMessage("Invalid Id"),
  validatorMiddleware,
];
