import { check } from "express-validator";
import { validatorMiddleware } from "../middlewares/validationMiddleware.js";

export const createCouponValidator = [
  check("code").notEmpty().withMessage("Code is required"),
  check("discount")
    .notEmpty()
    .withMessage("Discount is required")
    .isNumeric()
    .withMessage("Invalid Discount"),
  check("expiry").notEmpty().withMessage("Expiry is required"),
  validatorMiddleware,
];

export const updateCouponValidator = [
  check("id")
    .notEmpty()
    .withMessage("Id is required")
    .isMongoId()
    .withMessage("Invalid Id"),
  check("code").notEmpty().withMessage("Code is required"),
  check("discount")
    .notEmpty()
    .withMessage("Discount is required")
    .isNumeric()
    .withMessage("Invalid Discount"),
  check("expiry").notEmpty().withMessage("Expiry is required"),
  validatorMiddleware,
];

export const deleteCouponValidator = [
  check("id")
    .notEmpty()
    .withMessage("Id is required")
    .isMongoId()
    .withMessage("Invalid Id"),
  validatorMiddleware,
];

export const getCouponValidator = [
  check("id")
    .notEmpty()
    .withMessage("Id is required")
    .isMongoId()
    .withMessage("Invalid Id"),
  validatorMiddleware,
];
