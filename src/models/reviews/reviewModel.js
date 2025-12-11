import reviewSchema from "./reviewSchema.js";

// insert
export const insertReview = (obj) => {
  return reviewSchema(obj).save();
};

//Read all for the admin || public
export const getAllReviews = (filter) => {
  return reviewSchema
    .find(filter)
    .populate({ path: "userId", select: "-password -refereshToken" });
};

// get book by Id
export const getAReviewById = (_id) => {
  return reviewSchema.findById(_id);
};

// update book by id
export const updateAReviewById = (_id, obj) => {
  return reviewSchema.findByIdAndUpdate(_id, obj, { new: true });
};

//delete book by id
export const deleteAReviewById = (_id) => {
  return reviewSchema.findByIdAndDelete(_id);
};
