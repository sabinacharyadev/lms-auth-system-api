import mongoose from "mongoose";

export const connectToMongoDb = () => {
  try {
    const connect = mongoose.connect(process.env.CONNECTION_URI);
    if (connect) {
      console.log(`Database connected: ${process.env.CONNECTION_URI}`);
    }
  } catch (error) {
    console.log("Error:", error);
  }
};
