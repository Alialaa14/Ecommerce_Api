/* 
    SUBCATEGORY MODELING 
    -- NAME 
    -- PICTURE
    -- QUOTE (FOR BRANDING)
    -- CATEGORY (NOT IN SCHEMA BUT IN BUSSINESS MODEL)
    -- PRODUCTS (NOT IN SCHEMA BUT IN BUSSINESS MODEL)
    -- SOLD 
    -- QUANTITY
    
*/

import { Schema, model } from "mongoose";
const subcategorySchema = new Schema(
  {
    category: {
      type: Schema.Types.ObjectId,
      required: [true, "Category is Required"],
      ref: "Category",
    },
    name: {
      type: String,
      minLength: [3, "Too Short Subcategory Name"],
      maxLength: [20, "Too Long Subcategory Name"],
      required: [true, "Subcategory Name is Required"],
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
    },
  },
  { timestamps: true }
);

const Subcategory = model("Subcategory", subcategorySchema);

export default Subcategory;
