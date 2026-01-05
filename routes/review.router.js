import { Router } from "express";
import {
  createReview,
  deleteAllReviews,
  deleteReview,
  getReview,
  getReviews,
  updateReview,
} from "../services/review.controler.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { isAuthorized } from "../middlewares/isAuthorized.js";
import {
  deleteReviewValidator,
  createReviewValidator,
  updateReviewValidator,
} from "../validators/review.validator.js";
const router = Router({ mergeParams: true });

router
  .route("/")
  .post(
    isAuthenticated,
    isAuthorized("admin", "user"),
    createReviewValidator,
    createReview
  )
  .get(isAuthenticated, isAuthorized("admin", "user"), getReviews)
  .delete(isAuthenticated, isAuthorized("admin"), deleteAllReviews);

router
  .route("/:reviewId")
  .delete(
    isAuthenticated,
    isAuthorized("admin", "user"),
    deleteReviewValidator,
    deleteReview
  )
  .patch(
    isAuthenticated,
    isAuthorized("admin", "user"),
    updateReviewValidator,
    updateReview
  )
  .get(isAuthenticated, isAuthorized("admin", "user"), getReview);
export default router;
