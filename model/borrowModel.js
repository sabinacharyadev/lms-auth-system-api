import borrowModel from "../schema/borrowSchema.js";

// Create
export const createBorrow = (borrowObj) => {
  return borrowModel(borrowObj).save();
};

// return borrow based on filters | role
export const getManyBorrows = (filter) => {
  return borrowModel.find(filter);
};

// update
export const updateBorrow = (updatedBurrow) => {
  const { _id } = updatedBurrow;
  return borrowModel.findByIdAndUpdate(_id, updatedBurrow, { new: true });
};
