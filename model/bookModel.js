import bookModel from "../schema/bookSchema.js";

// Get all books which are available
export const getAllBooks = () => {
  return bookModel.find();
};

// GET book by ID
export const getBookById = (_id) => {
  return bookModel.findById(_id);
};

//Create
export const createBook = (bookObj) => {
  return bookModel(bookObj).save();
};

//update book
export const updateBookById = (updatedBookObj) => {
  const { id } = updatedBookObj;
  return bookModel.findByIdAndUpdate(id, updatedBookObj, { new: true });
};

// create book reviews
export const createBookReviews = (reviewObj) => {
  return bookModel.findOneAndUpdate(
    { _id: reviewObj.book_id },
    { $push: { reviews: reviewObj } }
  );
};

// update book reviews
export const updateBookReviews = (reviewObj) => {
  return bookModel.findOneAndUpdate(
    { _id: reviewObj.book_id, "reviews._id": reviewObj._id },
    { $set: { "reviews.$.status": reviewObj.status } },
    { new: true }
  );
};
