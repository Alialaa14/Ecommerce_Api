/*
    MODELING CATEGORY SCHEMA 
    -- NAME 
    -- PICTURE
    -- QUOTE (FOR BRANDING)
    -- SUBCATEGORY (NOT IN SCHEMA BUT IN BUSSINESS MODEL)
    -- PRODUCTS (NOT IN SCHEMA BUT IN BUSSINESS MODEL)
    -- SOLD 
    -- QUANTITY
*/

import { Schema, model } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      minLength: [5, "Too Short Category Name"],
      maxLength: [20, "Too Long Category Name"],
      required: [true, "Category Name is Required"],
      trim: true,
    },
    cover: {
      type: Object,
      required: true,
    },
    quote: {
      type: String,
      required: true,
      trim: true,
      maxLength: [50, "Too Long Quote"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    quantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Category = model("Category", categorySchema);

export default Category;
