import "dotenv/config";

import express from "express";
import cors from "cors";
import userRouter from "./routers/userRouter.js";
import bookRouter from "./routers/bookRouter.js";
import path from "path";
import borrowRouter from "./routers/borrowRouter.js";
import reviewRouter from "./routers/reviewRouter.js";
import { connectToMongoDb } from "./config/dbConfig.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to db
connectToMongoDb();

// Serve Images to Client
const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "/public")));

// Routers
app.use("/api/v1/users", userRouter);
app.use("/api/v1/books", bookRouter);
app.use("/api/v1/borrows", borrowRouter);
app.use("/api/v1/reviews", reviewRouter);

// Start Server
app.listen(PORT, (error) => {
  error ? console.log("Error", error) : console.log("Server is running");
});
