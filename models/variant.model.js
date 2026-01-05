/*
    VARIANT MODELING 
    {
        QUANTITY 
        COLOR
        PICTURES
        SIZE
        }
*/

import { Schema, model } from "mongoose";

const variantSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      required: [true, "Product is Required"],
    },
    color: {
      name: { type: String, required: true },
      hex: { type: String, required: true },
    },
    sizes: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        sold: { type: Number, default: 0 },
      },
    ],
    pictures: [
      {
        public_id: { type: String, required: [true, "Image is Required"] },
        secure_url: { type: String, required: [true, "Image is Required"] },
      },
    ],
  },
  { timestamps: true }
);

const Variant = model("Variant", variantSchema);

export default Variant;
