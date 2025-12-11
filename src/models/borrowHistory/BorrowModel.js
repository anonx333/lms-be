import BorrowModel from "./BorrowSchema.js";

// insert
export const insertBorrow = (obj) => {
  return BorrowModel(obj).save();
};

//Read all for the admin || public
export const getAllBorrows = (f) => {
  return BorrowModel.find(f);
};

// get borrow by Id
export const getABorrowById = (_id) => {
  return BorrowModel.findById(_id);
};

// update borrow by id
export const updateABorrowById = (_id, obj) => {
  return BorrowModel.findByIdAndUpdate(_id, obj, { new: true });
};

//delete borrow by id
// export const deleteABorrowById = (_id) => {
//   return BorrowModel.findByIdAndDelete(_id);
// };
