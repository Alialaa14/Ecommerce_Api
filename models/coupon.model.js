/*
    COUPON MODELING 
    -- COUPON NAME OF CODE 
    -- DISCOUNT
    -- Used 
    -- EXPIRY DATE
*/

import { Schema, model } from "mongoose";

const couponSchema = new Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon Code is Required"],
    },
    discount: {
      type: Number,
      required: [true, "Discount is Required"],
    },
    used: {
      type: Boolean,
      default: false,
    },
    expiry: {
      type: Date,
      required: [true, "Expiry is Required"],
    },
  },
  { timestamps: true }
);

const Coupon = model("Coupon", couponSchema);
export default Coupon;
