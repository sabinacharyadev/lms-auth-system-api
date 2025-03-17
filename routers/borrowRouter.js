import express from "express";
import { createBorrow, getManyBorrows } from "../model/borrowModel.js";
import {
  buildErrorResponse,
  buildSuccessResponse,
} from "../utility/responseHelper.js";
import { updateBookById } from "../model/bookModel.js";
import { userAuth } from "../middlewares/authMiddleware.js";

const borrowRouter = express.Router();

// GET USER BORROW
borrowRouter.get("/", userAuth, async (req, res) => {
  try {
    const { role, _id } = req.userInfo;

    const borrows =
      role === "admin"
        ? await getManyBorrows({})
        : await getManyBorrows({ user_id: _id });

    borrows?.length
      ? buildSuccessResponse(res, borrows, "Burrows")
      : buildErrorResponse(res, "No borrows available");
  } catch (error) {
    buildErrorResponse(res, error.message);
  }
});

// Create Borrow
borrowRouter.post("/", userAuth, async (req, res) => {
  try {
    const borrow = await createBorrow(req.body);

    // if the book is borrowed, we update the book's availabilty
    if (borrow?._id) {
      await updateBookById({
        id: borrow.book_id,
        status: "unavailable",
        due_date: borrow.due_date,
      });
    }

    borrow?._id
      ? buildSuccessResponse(
          res,
          borrow,
          "You have successfully borrowed this book, you can check your burrow history to find this information"
        )
      : buildErrorResponse(
          res,
          "Unable to burrow the book , please contact adminstration."
        );
  } catch (error) {
    buildErrorResponse(
      res,
      "Unable to burrow the book , please contact adminstration."
    );
  }
});

export default borrowRouter;
