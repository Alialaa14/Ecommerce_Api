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

import { UserImage } from "../utils/multer.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
const router = Router();

router
  .post("/register", UserImage.single("image"), registerValidator, register)
  .post("/login", loginValidator, login)
  .post("/logout", logout)
  .post("/forget-password", forgetPasswordValidator, forgetPassword)
  .post("/verify-otp", verifyOtpValidator, verifyPasswordOtp)
  .post("/reset-password", resetPassword)
  .post("/veriftion-otp", isAuthenticated, accountVerificationOtp)
  .post("/verify-account", isAuthenticated, verifyAccount);

export default router;
