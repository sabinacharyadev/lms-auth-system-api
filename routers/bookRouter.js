import express from "express";
import {
  buildErrorResponse,
  buildSuccessResponse,
} from "../utility/responseHelper.js";
import {
  createBook,
  getAllBooks,
  getBookById,
  updateBookById,
} from "../model/bookModel.js";
import { userAuth } from "../middlewares/authMiddleware.js";
import { newBookValidation } from "../middlewares/newBookValidationMiddleware.js";
import { thumbnailUploader } from "../middlewares/thumbnailUploader.js";
import cloudinaryUploader from "../middlewares/cloudinaryUploader.js";
import cloudinary from "../config/cloudinaryConfig.js";

const bookRouter = express.Router();

// Public routes
// GET all books
bookRouter.get("/", async (req, res) => {
  try {
    const books = await getAllBooks();

    books?.length
      ? buildSuccessResponse(res, books, "All Books")
      : buildErrorResponse(res, "No books available");
  } catch (error) {
    buildErrorResponse(res, "No books available");
  }
});

// Public routes
// GET one books
bookRouter.get("/:_id", async (req, res) => {
  try {
    const book = await getBookById(req.params._id);

    book?._id
      ? buildSuccessResponse(res, book, "Book details")
      : buildErrorResponse(res, "No book available");
  } catch (error) {
    buildErrorResponse(res, "No book available");
  }
});

// CREATE | Private Route - only admin can create book
bookRouter.post("/", userAuth, newBookValidation, async (req, res) => {
  try {
    const currentUser = req.userInfo;

    // user is not admin
    if (currentUser.role !== "admin") {
      return buildErrorResponse(res, "Not authorized to create book");
    }

    // if user is admin
    const book = await createBook(req.body);

    book?._id
      ? buildSuccessResponse(res, book, "Book created Successfully")
      : buildErrorResponse(res, "Unable to create a book");
  } catch (error) {
    if (error.code === 11000) {
      error.message =
        "There is another book that has similar ISBN. Plase change the isbn and try again";
    }
    buildErrorResponse(res, error.message);
  }
});

// UPDATE | Private Route - only admin can create book
// newBookValidation will be replaced by updateBookValidation
bookRouter.patch(
  "/",
  userAuth,
  thumbnailUploader.single("image"),
  async (req, res) => {
    try {
      const currentUser = req.userInfo;

      // user is not admin
      if (currentUser.role !== "admin") {
        return buildErrorResponse(res, "Not authorized to update book");
      }

      // Check if we have to upload a thumbnail for book
      // process the req once upload is done using thumbnailUploader
      if (req.file) {
        req.body.thumbnail = req.file.path.slice(6);
      }
      // if user is admin
      const book = await updateBookById(req.body);

      book?._id
        ? buildSuccessResponse(res, book, "Book updated Successfully")
        : buildErrorResponse(res, "Unable to update a book");
    } catch (error) {
      if (error.code === 11000) {
        error.message =
          "There is another book that has similar ISBN. Plase change the isbn and try again";
      }
      buildErrorResponse(res, error.message);
    }
  }
);

// Function to uplaod images to cloudianry
const uploadImageToCloudinary = async (files) => {
  return Promise.all(
    files.map((file) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "Books" }, (error, uploadedResult) => {
            if (error) {
              return reject(error);
            }

            return resolve(uploadedResult);
          })
          .end(file.buffer);
      });
    })
  );
};

// Create Book Images
bookRouter.patch(
  "/bookImages",
  userAuth,
  cloudinaryUploader.array("images", 5),
  async (req, res) => {
    try {
      const currentUser = req.userInfo;

      // user is not admin
      if (currentUser.role !== "admin") {
        return buildErrorResponse(res, "Not authorized to update book");
      }

      // Once multiple images are uploaded in multer memory storage
      // we get uploaded images info in req.files
      if (req.files?.length > 0) {
        // send these files to cloudinary
        const uplaodedImages = await uploadImageToCloudinary(req.files);

        const uploadedImagesUrl = uplaodedImages.map(
          (image) => image.secure_url
        );

        // Get the book and its existing images
        const bookImages = await getBookById(req.body.id);
        const existingImagesUrl = bookImages?.images;

        const updatedImages = [...existingImagesUrl, ...uploadedImagesUrl];

        const book = await updateBookById({
          id: req.body.id,
          images: updatedImages,
        });

        book?._id
          ? buildSuccessResponse(res, book, "Images uploaded successfully")
          : buildErrorResponse(res, "Could not upload the images!");
      }
    } catch (error) {
      buildErrorResponse(res, "Could not upload the images!");
    }
  }
);
export default bookRouter;
