import mongoose from "mongoose";

const DATABASE = "auth-system";
const CONNECTION_URI = process.env.CONNECTION_URI + DATABASE;

export const connectToMongoDB = () => {
  try {
    const connect = mongoose.connect(CONNECTION_URI);
    if (connect) {
      console.log(`Database connected successfully at ${CONNECTION_URI}`);
    }
  } catch (error) {
    console.log(error);
  }
};
