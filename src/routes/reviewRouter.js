import express from "express";
import { auth, isAdmin } from "../middlewares/authMiddleware.js";
import {
  createReviewValidation,
  updateReviewValidation,
} from "../middlewares/joiValidation.js";
import {
  createReview,
  getMyReviews,
  getReviews,
  updateReview,
} from "../controllers/reviewControllers.js";

const router = express.Router();

// create review
router.post("/:borrowId", createReviewValidation, auth, createReview);

// get my reviews
router.get("/", auth, getMyReviews);

// admin get all reviews
router.get("/all", auth, isAdmin, getReviews);

// updating review
router.patch("/:reviewId", updateReviewValidation, auth, isAdmin, updateReview);

export default router;
