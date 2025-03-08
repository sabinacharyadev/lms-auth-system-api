import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const sessionModel = mongoose.model("session", sessionSchema);
export default sessionModel;
