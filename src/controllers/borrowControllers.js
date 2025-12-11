import config from "../config/config.js";
import { getABookById, updateABookById } from "../models/books/BookModel.js";
import {
  getABorrowById,
  getAllBorrows,
  insertBorrow,
  updateABorrowById,
} from "../models/borrowHistory/BorrowModel.js";
import Stripe from "stripe";

const stripe = new Stripe(config.stripe.key);
export const createBorrowHistory = async (req, res, next) => {
  try {
    //
    const userId = req.userInfo._id;
    const userName = req.userInfo.fName;
    const { bookId } = req.params;

    const book = await getABookById(bookId);
    if (book) {
      if (book.isAvailable && book.status == "active") {
        // const { bookTitle, thumbnail } = req.body;
        const bookTitle = book.title;
        const thumbnail = book.thumbnail;

        const today = new Date();
        const dueDate = new Date(today.setDate(today.getDate() + 15));

        console.log("USERNAME", userName);

        const paymentIntent = await stripe.paymentIntents.create({
          amount: book.price * 100,
          currency: "aud",
          automatic_payment_methods: { enabled: true },
        });
        // creating a borrow
        const borrowHistory = await insertBorrow({
          userName,
          userId,
          bookId,
          bookTitle,
          thumbnail,
          dueDate,
          clientSecret: paymentIntent.client_secret,
        });

        //
        // update book availability
        const updatebook = await updateABookById(bookId, {
          isAvailable: false,
          expectedAvailable: dueDate,
        });

        return res.json({
          status: "success",
          message: "Book Ready to Borrow",
          borrowHistory,
          updatebook,
          clientSecret: paymentIntent.client_secret,
        });
      } else {
        next({
          status: 404,
          message: "Book not Available",
        });
      }
    } else {
      next({
        status: 404,
        message: "Book not found",
      });
    }
  } catch (error) {
    next(error);
  }
};

// get current user borrorw history
export const getBorrowHistory = async (req, res, next) => {
  try {
    // {userId: <id>}
    const fitler = {
      userId: req.userInfo._id,
    };

    const borrows = await getAllBorrows(fitler);

    return res.json({
      status: "success",
      message: "Borrow History Listed!",
      borrows,
    });
  } catch (error) {
    next(error);
  }
};

// get all borrow history
export const getAllBorrowHistory = async (req, res, next) => {
  try {
    // {userId: <id>}
    const borrows = await getAllBorrows({});

    return res.json({
      status: "success",
      message: "Borrow History Listed!",
      borrows,
    });
  } catch (error) {
    next(error);
  }
};

// return book
export const returnBook = async (req, res, next) => {
  try {
    // get book id
    const { borrowId } = req.params;

    const borrowHistory = await getABorrowById(borrowId);

    if (
      borrowHistory &&
      String(borrowHistory.userId) === String(req.userInfo._id) &&
      borrowHistory.status === "borrowed"
    ) {
      // update borrow
      const updateBorrow = await updateABorrowById(borrowId, {
        status: "returned",
        returnedDate: new Date(),
      });

      // update book availability
      const updateBook = await updateABookById(borrowHistory.bookId, {
        isAvailable: true,
      });

      return res.json({
        status: "success",
        message: "Book returned",
      });
    } else {
      const error = {
        message: "Borrow not found",
      };
      next(error);
    }
  } catch (error) {
    next(error);
  }
};
