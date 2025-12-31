import { ENV } from "../utils/ENV.js";

const sendErrorForDev = (error, res) => {
  return res.status(error.statusCode).json({
    status: error.status,
    error,
    message: error.message,
    stack: error.stack,
  });
};

const sendErrorForProduction = (error, res) => {
  return res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    statusCode: error.statusCode,
  });
};

export const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (ENV.NODE_ENV === "development") {
    sendErrorForDev(err, res);
  } else {
    sendErrorForProduction(err, res);
  }
};
