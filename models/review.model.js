/*
    REVIEW MODELING 
    -- USER 
    -- TITLE OF REVIEW 
    -- CONTENT OF REVIEW (TEXT)
    -- RATING 
    -- PICS UPLOAD
*/
import { Schema, model } from "mongoose";

const reviewSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: [true, "User is required"],
      ref: "User",
    },
    product: {
      type: Schema.Types.ObjectId,
      required: [true, "Product is required"],
      ref: "Product",
    },
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
    },
  },
  { timestamps: true }
);

const Review = model("Review", reviewSchema);
export default Review;
