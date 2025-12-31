import CustomError from "../utils/Custom-Api-error.js";
import jwt from "jsonwebtoken";
import { ENV } from "../utils/ENV.js";
export const isAuthenticated = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token)
      return res.status(400).json({
        success: false,
        message: "Couldn't Found Token Please Login First",
      });

    // DECODE JWT TOKEN
    const decoded = jwt.verify(token, ENV.SECRET_KEY);
    if (!decoded)
      return res.status(400).json({
        success: false,
        message: "Couldn't Found Token Please Login First",
      });
    req.user = decoded;
    return next();
  } catch (error) {
    return next(new CustomError(500, error.message));
  }
};
