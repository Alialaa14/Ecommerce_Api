/*
    COUPON CONTROLER (BY ADMIN)

    -- CREATE COUPON 
    -- UPDATE COUPON
    -- DELETE COUPON
*/

import CustomError from "../utils/Custom-Api-error.js";
import Coupon from "../models/coupon.model.js";

export const createCoupon = async (req, res, next) => {
  try {
    const { code, discount, expiry } = req.body;

    const dateNow = new Date();
    const expiryDate = new Date(expiry);

    if (dateNow >= expiryDate)
      return res
        .status(400)
        .json({ success: false, message: "Expiry Date is Expired" });

    const coupon = await Coupon.create({ code, discount, expiry });
    if (!coupon)
      return res
        .status(400)
        .json({ success: false, message: "Coupon Not Created" });

    return res.status(201).json({
      success: true,
      message: "Coupon Created Successfully",
      data: coupon,
    });
  } catch (error) {
    return next(new CustomError(500, error));
  }
};
export const updateCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { code, discount, expiry } = req.body;

    const dateNow = new Date();
    const expiryDate = new Date(expiry);

    if (dateNow >= expiryDate)
      return res
        .status(400)
        .json({ success: false, message: "Expiry Date is Expired" });

    const coupon = await Coupon.findOneAndUpdate(
      { _id: id },
      { code, discount, expiry }
    );
    if (!coupon)
      return res
        .status(400)
        .json({ success: false, message: "Coupon Not Updated" });

    return res.status(201).json({
      success: true,
      message: "Coupon Updated Successfully",
      data: coupon,
    });
  } catch (error) {
    return next(new CustomError(500, error));
  }
};
export const deleteCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findOneAndDelete({ _id: id });
    if (!coupon)
      return res
        .status(400)
        .json({ success: false, message: "Coupon Not Deleted" });

    return res.status(201).json({
      success: true,
      message: "Coupon Deleted Successfully",
      data: coupon,
    });
  } catch (error) {
    return next(new CustomError(500, error));
  }
};
export const getCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findById(id);
    if (!coupon)
      return res
        .status(400)
        .json({ success: false, message: "Coupon Not Found" });

    return res.status(200).json({ success: true, data: coupon });
  } catch (error) {
    return next(new CustomError(500, error));
  }
};
export const getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find();
    if (!coupons)
      return res
        .status(400)
        .json({ success: false, message: "Coupons Not Found" });

    return res.status(200).json({ success: true, data: coupons });
  } catch (error) {
    return next(new CustomError(500, error));
  }
};
