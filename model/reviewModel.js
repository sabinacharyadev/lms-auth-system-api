import reviewModel from "../schema/reviewSchema.js";

//Create
export const createReview = (reviewObj) => {
  return reviewModel(reviewObj).save();
};

// return many review as an array
export const getManyReview = (filter) => {
  return reviewModel.find(filter);
};
