/*
  CART MODELING 
  
  -- USER 
  -- PRODUCTS
  -- ACCUMALTIVE PRICE OF ALL PRODUCTS
  -- ORDER NOTE
  -- COUPON CODE
 */

import { Schema, model } from "mongoose";

const cartSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
      variantId: {
        type: Schema.Types.ObjectId,
        ref: "Variant",
      },
      color: {
        type: Object,
        required: [true, "Color is required"],
      },
      variant: {
        type: Object,
        required: [true, "Variant is required"],
      },
      picture: {
        public_id: {
          type: String,
          // required: [true, "Picture Id is required"],
        },
        secure_url: {
          type: String,
          // required: [true, "Picture Url is required"],
        },
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  subtotal: {
    type: Number,
    default: 0,
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
  orderNote: {
    type: String,
    trim: true,
    default: "",
  },
  coupon: {
    type: Schema.Types.ObjectId,
    ref: "Coupon",
    default: null,
  },
});

const Cart = model("Cart", cartSchema);
export default Cart;
