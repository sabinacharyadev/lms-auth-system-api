import mongoose from "mongoose";

export const reviewSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: "unapproved",
    },
    burrow_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    book_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    book_title: {
      type: String,
      required: true,
    },
    user_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    user_name: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 5,
    },
  },
  {
    timestamps: true,
  }
);

const reviewModel = mongoose.model("review", reviewSchema);
export default reviewModel;
