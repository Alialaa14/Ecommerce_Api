import { check } from "express-validator";
import { validatorMiddleware } from "../middlewares/validationMiddleware.js";

export const createProductValidator = [
  // BASIC FIELDS
  check("name")
    .exists()
    .withMessage("Name is required")
    .bail()
    .isString()
    .withMessage("Name must be a string")
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty"),

  check("description")
    .exists()
    .withMessage("Description is required")
    .bail()
    .isString()
    .withMessage("Description must be a string")
    .trim()
    .isLength({ min: 10, max: 70 })
    .withMessage("Description must be between 10 and 70 characters"),

  check("subcategory")
    .exists()
    .withMessage("Subcategory is required")
    .bail()
    .isString()
    .withMessage("Subcategory must be a string")
    .trim(),

  check("price")
    .exists()
    .withMessage("Price is required")
    .bail()
    .isFloat({ gt: 0 })
    .withMessage("Price must be greater than 0"),

  // VARIANT
  check("variant")
    .exists()
    .withMessage("Variant is required")
    .bail()
    .custom((v) => Array.isArray(v) && v.length > 0)
    .withMessage("Variant must be a non-empty array"),

  // VARIANT → COLOR
  check("variant.*.color")
    .exists()
    .withMessage("Color is required")
    .bail()
    .custom((v) => typeof v === "object" && v !== null)
    .withMessage("Color must be an object"),

  check("variant.*.color.name")
    .exists()
    .withMessage("Color name is required")
    .bail()
    .isString()
    .withMessage("Color name must be a string")
    .notEmpty()
    .withMessage("Color name cannot be empty"),

  check("variant.*.color.hex")
    .exists()
    .withMessage("Color hex is required")
    .bail()
    .matches(/^#([0-9A-F]{3}){1,2}$/i)
    .withMessage("Invalid color hex"),

  // VARIANT → SIZES
  check("variant.*.sizes")
    .exists()
    .withMessage("Sizes are required")
    .bail()
    .custom((v) => Array.isArray(v) && v.length > 0)
    .withMessage("At least one size is required"),

  check("variant.*.sizes.*.name")
    .exists()
    .withMessage("Size name is required")
    .bail()
    .isString()
    .withMessage("Size name must be a string")
    .notEmpty()
    .withMessage("Size name cannot be empty"),

  check("variant.*.sizes.*.quantity")
    .exists()
    .withMessage("Quantity is required")
    .bail()
    .isInt({ min: 0 })
    .withMessage("Quantity must be ≥ 0"),

  validatorMiddleware,
];

export const updateProductValidtor = [
  // BASIC FIELDS
  check("name")
    .exists()
    .withMessage("Name is required")
    .bail()
    .isString()
    .withMessage("Name must be a string")
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty"),

  check("description")
    .exists()
    .withMessage("Description is required")
    .bail()
    .isString()
    .withMessage("Description must be a string")
    .trim()
    .isLength({ min: 10, max: 70 })
    .withMessage("Description must be between 10 and 70 characters"),

  check("subcategory")
    .exists()
    .withMessage("Subcategory is required")
    .bail()
    .isString()
    .withMessage("Subcategory must be a string"),

  check("price")
    .exists()
    .withMessage("Price is required")
    .bail()
    .isFloat({ gt: 0 })
    .withMessage("Price must be greater than 0"),

  // VARIANT
  check("variant")
    .exists()
    .withMessage("Variant is required")
    .bail()
    .custom((v) => Array.isArray(v) && v.length > 0)
    .withMessage("Variant must be a non-empty array"),

  // VARIANT → COLOR
  check("variant.*.color")
    .exists()
    .withMessage("Color is required")
    .bail()
    .custom((v) => typeof v === "object" && v !== null)
    .withMessage("Color must be an object"),

  check("variant.*.color.name")
    .exists()
    .withMessage("Color name is required")
    .bail()
    .isString()
    .withMessage("Color name must be a string")
    .notEmpty()
    .withMessage("Color name cannot be empty"),

  check("variant.*.color.hex")
    .exists()
    .withMessage("Color hex is required")
    .bail()
    .matches(/^#([0-9A-F]{3}){1,2}$/i)
    .withMessage("Invalid color hex"),

  // VARIANT → SIZES
  check("variant.*.sizes")
    .exists()
    .withMessage("Sizes are required")
    .bail()
    .custom((v) => Array.isArray(v) && v.length > 0)
    .withMessage("At least one size is required"),

  check("variant.*.sizes.*.name")
    .exists()
    .withMessage("Size name is required")
    .bail()
    .isString()
    .withMessage("Size name must be a string")
    .notEmpty()
    .withMessage("Size name cannot be empty"),

  check("variant.*.sizes.*.quantity")
    .exists()
    .withMessage("Quantity is required")
    .bail()
    .isInt({ min: 0 })
    .withMessage("Quantity must be ≥ 0"),

  validatorMiddleware,
];
