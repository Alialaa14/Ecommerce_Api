/**
 -- ORDER MODELING 
 -- USER
 -- PRODUCTS AND QUANTITY
 -- ORDER STATUS
 -- ORDER NOTE
 -- COUPON CODE
 -- PAYMENT METHOD
 -- ADDRESS OF DELIVERY
 -- ESTIMATED DELIVERY
 */

import { Schema, model } from "mongoose";

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: [true, "User is required"],
      ref: "User",
    },
    products: {
      type: Array,
      required: [true, "Products are required"],
    },
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    orderNote: {
      type: String,
      trim: true,
    },
    orderCoupon: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "visa"],
      default: "cash",
    },
    address: {
      type: String,
      trim: true,
      required: [true, "Address is required"],
    },
    estimatedDelivery: {
      type: Date,
    },
    total: {
      type: Number,
      required: [true, "Total is required"],
    },
    paid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Order = model("Order", orderSchema);
export default Order;
