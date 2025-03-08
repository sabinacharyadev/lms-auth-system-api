import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectToMongoDB } from "./config/dbConfig.js";

const app = express();

const PORT = process.env.PORT || 3000;

connectToMongoDB();

app.use(express.json());

const corsOption = {
  credential: true,
  origin: true,
};

app.use(cors(corsOption));
app.listen(PORT, (error) => {
  error
    ? console.log(error.message)
    : console.log(`Server Running Successfully`);
});
