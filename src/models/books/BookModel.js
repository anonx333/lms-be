import BookSchema from "./BookSchema.js";

// insert
export const insertBook = (obj) => {
  return BookSchema(obj).save();
};

//Read all for the admin || public
export const getAllBooks = (filter, options = { sort: "publishedYear" }) => {
  return BookSchema.find(filter).sort(options.sort);
};

// get book by Id
export const getABookById = (_id) => {
  return BookSchema.findById(_id);
};

// update book by id
export const updateABookById = (_id, obj) => {
  return BookSchema.findByIdAndUpdate(_id, obj, { new: true });
};

//delete book by id
export const deleteABookById = (_id) => {
  return BookSchema.findByIdAndDelete(_id);
};
