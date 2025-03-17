import userModel from "../schema/useSchema.js";

// create a user
export const createUser = (userObj) => {
  return userModel(userObj).save();
};

// Update User
export const updateUser = (filter, updatedUser) => {
  return userModel.findOneAndUpdate(filter, updatedUser, { new: true });
};

// Find user by email
export const findUserByEmail = (email) => {
  return userModel.findOne({ email });
};
