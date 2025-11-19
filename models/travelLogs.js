import mongoose from "mongoose";

const travelLogSchema = new mongoose.Schema(
  {
    fromLocation: String,
    toLocation: String,
    amount: Number,
    date: { type: Date, required: true },
    slipImageUrl: String,
  },
  { timestamps: true }
);

export default mongoose.model("TravelLog", travelLogSchema);
