import { Router } from "express";
import {
  accountVerificationOtp,
  forgetPassword,
  login,
  logout,
  register,
  resetPassword,
  verifyAccount,
  verifyPasswordOtp,
} from "../services/user.controler.js";
import {
  forgetPasswordValidator,
  loginValidator,
  registerValidator,
  verifyOtpValidator,
} from "../validators/user.validator.js";

import { ImageUpload } from "../utils/multer.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { isAuthorized } from "../middlewares/isAuthorized.js";
const router = Router();

router
  .post("/register", ImageUpload.single("image"), registerValidator, register)
  .post("/login", loginValidator, login)
  .post("/logout", logout)
  .post("/forget-password", forgetPasswordValidator, forgetPassword)
  .post("/verify-otp", verifyOtpValidator, verifyPasswordOtp)
  .post("/reset-password", resetPassword)
  .post("/veriftion-otp", isAuthenticated, accountVerificationOtp)
  .post(
    "/verify-account",
    isAuthenticated,
    isAuthorized("user"),
    verifyAccount
  );

export default router;
