import express from "express";
import {
  buildErrorResponse,
  buildSuccessResponse,
} from "../utility/responseHelper.js";
import { createReview, getManyReview } from "../model/reviewModel.js";
import { updateBorrow } from "../model/borrowModel.js";
import { createBookReviews } from "../model/bookModel.js";
import { userAuth } from "../middlewares/authMiddleware.js";

const reviewRouter = express.Router();

reviewRouter.get("/", async (req, res) => {
  try {
    const reviews = await getManyReview({});

    reviews?.length
      ? buildSuccessResponse(res, reviews, "Reviews")
      : buildErrorResponse(res, "No reviews available");
  } catch (error) {
    buildErrorResponse(res, "No reviews available");
  }
});

// CREATE a review
reviewRouter.post("/", userAuth, async (req, res) => {
  try {
    const review = await createReview(req.body);

    if (review?._id) {
      // update burrow to to set has_review: true
      const updatedBurrow = {
        _id: review.burrow_id,
        has_review: true,
      };

      await updateBorrow(updatedBurrow);

      await createBookReviews(review);
    }

    review?._id
      ? buildSuccessResponse(res, review, "Thank you for the review.")
      : buildErrorResponse(res, "Something went wrong.");
  } catch (error) {
    buildErrorResponse(res, error.message);
  }
});

export default reviewRouter;
