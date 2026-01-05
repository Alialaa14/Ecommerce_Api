/* 
    PRODUCT MODELING 

    -- NAME 
    -- DESCRITPTION
    -- VIEWS
    -- CATEGORY
    -- REVIEWS
    -- VERSIONS OF PRODUCTS
    -- PRICE
       {
        QUANTITY 
        COLOR
        PICTURES
        SIZE
        }
*/

import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name of product is required"],
      minLength: [10, "Too Short Name"],
      maxLength: [30, "Too Long Name"],
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxLength: [70, "Too Long Description"],
    },
    views: {
      type: Number,
      default: 0,
    },
    subcategory: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    reviews: {
      type: [Schema.Types.ObjectId],
      default: [],
      ref: "Review",
    },
    price: {
      type: Number,
      required: [true, "Price is Required"],
    },
    variants: {
      type: [Schema.Types.ObjectId],
      required: [true, "Variants are required"],
      ref: "Variant",
    },
  },
  { timestamps: true }
);

const Product = model("Product", productSchema);

export default Product;
