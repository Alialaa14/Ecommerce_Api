import { Router } from "express";
import {
  createOrder,
  getOrder,
  getOrders,
  updateOrder,
} from "../services/order.controler.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { isAuthorized } from "../middlewares/isAuthorized.js";

const router = Router();

router
  .route("/")
  .post(isAuthenticated, isAuthorized("admin", "user"), createOrder)
  .get(isAuthenticated, isAuthorized("user"), getOrders);

router
  .route("/:orderId")
  .get(isAuthenticated, isAuthorized("admin", "user"), getOrder)
  .patch(isAuthenticated, isAuthorized("admin"), updateOrder);
export default router;
