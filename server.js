import "dotenv/config";

import express from "express";
import cors from "cors";
import { connectToMongoDB } from "./config/dbConfig.js";
import userRouter from "./routers/userRouter.js";
import bookRouter from "./routers/bookRouter.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to db
connectToMongoDB();

// Serve Images to Client
import path from "path";
import borrowRouter from "./routers/borrowRouter.js";
const __dirname = path.resolve();
console.log("__dirname", __dirname);

app.use(express.static(path.join(__dirname, "/public")));

// Routers
app.use("/api/v1/users", userRouter);
app.use("/api/v1/books", bookRouter);
app.use("/api/v1/borrows", borrowRouter);

// Start Server
app.listen(PORT, (error) => {
  error ? console.log("Error", error) : console.log("Server is running");
});
