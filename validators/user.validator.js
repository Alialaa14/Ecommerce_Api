import { check } from "express-validator";
import { validatorMiddleware } from "../middlewares/validationMiddleware.js";
export const registerValidator = [
  check("username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 letters")
    .isLength({ max: 20 })
    .withMessage("Username must be under 20 letters"),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid Email"),
  check("password")
    .notEmpty()
    .withMessage("Password is Required")
    .isLength({ min: 5 })
    .withMessage("Password is too Short")
    .isLength({ max: 20 })
    .withMessage("Too Long Password"),
  validatorMiddleware,
];

export const loginValidator = [
  check("email").notEmpty().withMessage("Email is Required").trim(),
  check("password").notEmpty().withMessage("Password is Required"),
];

export const forgetPasswordValidator = [
  check("email").notEmpty().withMessage("Email is Required").trim(),
];

export const verifyOtpValidator = [
  check("otp").notEmpty().withMessage("otp is Required").trim(),
];
