import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/thumbnail");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname); // Get the file extension
    cb(null, file.fieldname + "-" + uniqueSuffix + fileExtension); // Append the extension
  },
});

export const thumbnailUploader = multer({ storage: storage });
