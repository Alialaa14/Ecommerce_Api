import { Router } from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { isAuthorized } from "../middlewares/isAuthorized.js";
import {
  addToCart,
  cancelCoupon,
  getCart,
  removeFromCart,
  resetCart,
  updateCart,
} from "../services/cart.controler.js";
const router = Router();

router
  .route("/:productId")
  .post(isAuthenticated, isAuthorized("user"), addToCart);

router
  .route("/:productId/:variantId")
  .delete(isAuthenticated, isAuthorized("user"), removeFromCart);
router
  .route("/")
  .get(isAuthenticated, isAuthorized("user"), getCart)
  .patch(isAuthenticated, isAuthorized("user"), updateCart)
  .put(isAuthenticated, isAuthorized("user"), cancelCoupon)
  .delete(isAuthenticated, isAuthorized("user"), resetCart);

export default router;
