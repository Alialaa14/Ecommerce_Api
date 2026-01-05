import { Router } from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { isAuthorized } from "../middlewares/isAuthorized.js";
import {
  createCoupon,
  deleteCoupon,
  getCoupons,
  updateCoupon,
} from "../services/coupon.controler.js";
import {
  deleteCouponValidator,
  createCouponValidator,
  updateCouponValidator,
} from "../validators/coupon.validator.js";

const router = Router();

router
  .route("/")
  .post(
    isAuthenticated,
    isAuthorized("admin"),
    createCouponValidator,
    createCoupon
  )
  .get(isAuthenticated, isAuthorized("admin"), getCoupons);

router
  .route("/:id")
  .patch(
    isAuthenticated,
    isAuthorized("admin"),
    updateCouponValidator,
    updateCoupon
  )
  .delete(
    isAuthenticated,
    isAuthorized("admin"),
    deleteCouponValidator,
    deleteCoupon
  );

export default router;
