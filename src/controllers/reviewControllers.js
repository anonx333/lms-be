import { updateABookById } from "../models/books/BookModel.js";
import {
  getABorrowById,
  updateABorrowById,
} from "../models/borrowHistory/BorrowModel.js";
import {
  getAllReviews,
  getAReviewById,
  insertReview,
  updateAReviewById,
} from "../models/reviews/reviewModel.js";

export const createReview = async (req, res, next) => {
  try {
    // get user
    const userId = req.userInfo._id;

    // get borrow Id
    const { borrowId } = req.params;

    // get review body
    const { title, description, rating } = req.body;

    // get borrow data
    const borrow = await getABorrowById(borrowId);

    if (String(borrow.userId) == String(req.userInfo._id)) {
      const review = await insertReview({
        userId,
        borrowId,
        bookId: borrow.bookId,
        title,
        description,
        rating,
      });

      // update borrow status
      const updateBorrow = await updateABorrowById(borrowId, {
        status: "reviewed",
      });

      return res.json({
        status: "success",
        message: "Review created!",
        review,
      });
    } else {
      const error = {
        message: "User not authorized to review",
      };
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

// get my reviews
export const getMyReviews = async (req, res, next) => {
  try {
    // get user
    const userId = req.userInfo._id;

    const reviews = await getAllReviews({ userId });

    return res.json({
      status: "success",
      message: "Reviews Listed",
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// get all reviews
export const getReviews = async (req, res, next) => {
  try {
    const reviews = await getAllReviews();

    return res.json({
      status: "success",
      message: "Reviews Listed",
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// update a review
export const updateReview = async (req, res, next) => {
  try {
    // review id
    const { reviewId } = req.params;

    // // review object
    const review = await getAReviewById(reviewId);

    if (review) {
      //body
      const { status } = req.body;

      // update review
      const updateReview = await updateAReviewById(reviewId, {
        status,
      });

      // updat the book rating
      const allReviews = await getAllReviews({
        bookId: review.bookId,
        status: "active",
      });

      const avgRating = (
        allReviews.reduce((acc, item) => acc + item.rating, 0) /
        allReviews.length
      ).toFixed(2);

      // update book
      const book = await updateABookById(review.bookId, {
        avgRating,
      });

      return res.json({
        status: "success",
        mesasge: "Review Updated",
        review: updateReview,
      });
    } else {
      const error = {
        message: "Review not found",
      };
      next(error);
    }
  } catch (error) {
    next(error);
  }
};
