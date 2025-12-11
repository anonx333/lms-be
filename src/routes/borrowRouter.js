import express from "express";
import { auth, isAdmin } from "../middlewares/authMiddleware.js";
import {
  createBorrowHistory,
  getAllBorrowHistory,
  getBorrowHistory,
  returnBook,
} from "../controllers/borrowControllers.js";

const router = express.Router();

// create borrow history
// TODO: add validation
router.post("/:bookId", auth, createBorrowHistory);

// get my borrows
router.get("/", auth, getBorrowHistory);

// get all borrows
router.get("/", auth, isAdmin, getAllBorrowHistory);

// return books
router.post("/:borrowId/return", auth, returnBook);

export default router;
