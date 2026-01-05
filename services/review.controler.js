/*
    REVIEW CONTROLER 

    -- CREATE CONTROLER 
    -- UPDATE CONTROLER 
    -- DELETE CONTROLER (USER AND ADMIN)
*/

import CustomError from "../utils/Custom-Api-error.js";
import Review from "../models/review.model.js";
import mongoose from "mongoose";
import Product from "../models/product.model.js";
export const createReview = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const user = req.user.user._id;
    const { title, content, rating } = req.body;

    const review = await Review.create({
      user: new mongoose.Types.ObjectId(user),
      product: productId,
      title,
      content,
      rating,
    });

    if (!review)
      return res
        .status(400)
        .json({ success: false, message: "Review Not Created" });

    const product = await Product.findByIdAndUpdate(productId, {
      $push: { reviews: review._id },
    });

    if (!product)
      return res
        .status(400)
        .json({ success: false, message: "Unable to create review" });
    return res
      .status(201)
      .json({ success: true, message: "Review Created Successfully", review });
  } catch (error) {
    return next(new CustomError(500, error));
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const user = req.user.user._id;
    const reviewId = req.params.reviewId;
    const { title, content, rating } = req.body;

    const review = await Review.findByIdAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(reviewId),
        user: new mongoose.Types.ObjectId(user),
      },
      {
        title,
        content,
        rating,
      }
    );

    if (!review)
      return res
        .status(400)
        .json({ success: false, message: "Unable to update review" });

    return res
      .status(200)
      .json({ success: true, message: "Review Updated Successfully", review });
  } catch (error) {
    return next(new CustomError(500, error));
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const user = req.user.user._id;
    const reviewId = req.params.reviewId;
    const productId = req.params.productId;

    const review = await Review.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(reviewId),
      user: new mongoose.Types.ObjectId(user),
    });

    if (!review)
      return res
        .status(400)
        .json({ success: false, message: "Unable to delete review" });

    const product = await Product.findByIdAndUpdate(productId, {
      $pull: { reviews: review._id },
    });

    if (!product)
      return res
        .status(400)
        .json({ success: false, message: "Unable to delete2 review" });

    return res
      .status(200)
      .json({ success: true, message: "Review Deleted Successfully" });
  } catch (error) {
    return next(new CustomError(500, error));
  }
};

export const getReviews = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    console.log(productId);

    const reviews = await Review.find({
      product: new mongoose.Types.ObjectId(productId),
    });

    console.log(reviews);

    if (!reviews)
      return res
        .status(400)
        .json({ success: false, message: "We Couldn't Find Reviews" });

    return res.status(200).json({
      success: true,
      message: "Reviews Fetched Successfully",
      data: reviews,
    });
  } catch (error) {
    return next(new CustomError(500, error));
  }
};

export const getReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review)
      return res
        .status(400)
        .json({ success: false, message: "We Couldn't Find Review" });

    return res.status(200).json({
      success: true,
      message: "Review Fetched Successfully",
      data: review,
    });
  } catch (error) {
    return next(new CustomError(500, error));
  }
};

export const deleteAllReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.deleteMany({ product: productId });

    if (!reviews)
      return res
        .status(400)
        .json({ success: false, message: "Unable to delete reviews" });

    const product = await Product.findByIdAndUpdate(productId, {
      $set: { reviews: [] },
    });
    if (!product)
      return res
        .status(400)
        .json({ success: false, message: "Unable to delete reviews" });
    return res
      .status(200)
      .json({ success: true, message: "Reviews Deleted Successfully" });
  } catch (error) {
    return next(new CustomError(500, error));
  }
};
