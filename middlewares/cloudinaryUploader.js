import multer from "multer";

// Configure multer to use memory storage
const cloudinaryUploader = multer({ storage: multer.memoryStorage() });

export default cloudinaryUploader;
