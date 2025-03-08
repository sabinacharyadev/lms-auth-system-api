import sessionModel from "../schema/sessionSchema.js";

//read @filter must be an object
export const getSession = (filter) => {
  return sessionModel.findOne(filter);
};

//Create
export const createSession = (sessionObj) => {
  return sessionModel(sessionObj).save();
};

//delete
export const deleteSession = (filter) => {
  return sessionModel.findOneAndDelete(filter);
};
