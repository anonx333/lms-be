import { PutObjectCommand } from "@aws-sdk/client-s3";
import {
  deleteABookById,
  getABookById,
  getAllBooks,
  insertBook,
  updateABookById,
} from "../models/books/BookModel.js";
import { getAllReviews } from "../models/reviews/reviewModel.js";
import config from "../config/config.js";
import { s3Client } from "../config/s3.config.js";
import fs from "fs";
import path from "path";

export const fetchPublicBooks = async (req, res, next) => {
  try {
    // get all books with status 'active' true

    const books = await getAllBooks({ status: "active" });

    const reviews = await getAllReviews({ status: "active" });

    const booksWithReviews = books.map((item) => {
      return {
        ...(item.toObject?.() || item),
        reviews: reviews.filter((r) => String(r.bookId) === String(item._id)),
      };
    });

    // for (const book of books) {
    //   console.log(
    //     "review",
    //     reviews.filter((item) => String(item.bookId) === String(book._id))
    //   );
    //   book.reviews = reviews.filter(
    //     (item) => String(item.bookId) === String(book._id)
    //   );
    // }

    return res.json({
      status: "success",
      message: "Books Found!",
      books: booksWithReviews,
    });
  } catch (error) {
    next(error);
  }
};

// fetching all books
export const fetchAllBooks = async (req, res, next) => {
  try {
    // get all books with status 'active' true
    const { sort } = req.query;

    const books = await getAllBooks({}, { sort });

    // attach reviews for each book (admin view)
    const reviews = await getAllReviews({});

    for (const book of books) {
      book.reviews = reviews.filter(
        (item) => String(item.bookId) === String(book._id)
      );
    }

    return res.json({
      status: "success",
      message: "Books Found!",
      books,
    });
  } catch (error) {
    next(error);
  }
};

export const fetchBookDetail = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const book = await getABookById(bookId);

    // attach reviews for this book (public/admin depending on caller)
    const bookReviews = await getAllReviews({ bookId, status: "active" });
    if (book) {
      book.reviews = bookReviews;
    }

    return res.json({
      status: "success",
      message: "Book Found",
      book,
    });
  } catch (error) {
    next(error);
  }
};

// create book controller
export const createBook = async (req, res, next) => {
  try {
    // upload file
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const bookObject = req.body;

    if (req.file) {
      const file = req.file;
      const fileStream = fs.createReadStream(file.path);

      const key = `uploads/${Date.now()}-${file.originalname}`;

      const command = new PutObjectCommand({
        Bucket: config.aws.bucket_name,
        Key: key,
        Body: fileStream,
        ContentType: file.mimetype,
      });

      await s3Client.send(command);

      // Generate public URL
      const fileUrl = `https://${config.aws.bucket_name}.s3.${config.aws.config.region}.amazonaws.com/${key}`;

      // Delete temp file
      fs.unlinkSync(file.path);

      // s3 url
      bookObject.thumbnail = fileUrl;
    }

    const book = await insertBook(bookObject);

    return res.json({
      status: "success",
      message: "Book Created!",
      book,
    });
  } catch (error) {
    next(error);
  }
};

// update a book
export const updateBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateObj = req.body;

    if (req.file) {
      const file = req.file;
      const fileStream = fs.createReadStream(file.path);

      const key = `uploads/${Date.now()}-${file.originalname}`;

      const command = new PutObjectCommand({
        Bucket: config.aws.bucket_name,
        Key: key,
        Body: fileStream,
        ContentType: file.mimetype,
      });

      await s3Client.send(command);

      // Generate public URL
      const fileUrl = `https://${config.aws.bucket_name}.s3.${config.aws.config.region}.amazonaws.com/${key}`;

      // Delete temp file
      fs.unlinkSync(file.path);

      // s3 url
      updateObj.thumbnail = fileUrl;
    }

    const book = await updateABookById(id, updateObj);

    return res.json({
      status: "success",
      message: "Book updated!",
      book,
    });
  } catch (error) {
    next(error);
  }
};

// delete a book
export const removeBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const book = await deleteABookById(id);

    return res.json({
      status: "success",
      message: "Book Deleted!",
    });
  } catch (error) {
    next(error);
  }
};
