import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: "available",
    },
    thumbnail: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    publish_year: {
      type: String,
      required: true,
    },
    isbn: {
      type: String,
      unique: true,
      index: 1,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    due_date: {
      type: Date,
      required: false,
    },
    images: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const bookModel = mongoose.model("book", bookSchema);
export default bookModel;
