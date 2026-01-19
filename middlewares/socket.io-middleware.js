import { io } from "../server.js";
import jwt from "jsonwebtoken";
import { ENV } from "../utils/ENV.js";

export const socketAuth = (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("No token provided"));
    }

    const decoded = jwt.verify(token, ENV.SECRET_KEY);

    if (!decoded) {
      return next(new Error("Invalid token"));
    }

    // Attach user to socket
    socket.user = decoded.user.role; // 👈 important
    next();
  } catch (error) {
    next(new Error(error.message));
  }
};
