// models/HospitalCard.js
import mongoose from "mongoose";

const hospitalCardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  moreLink: { type: String, default: "" }
});

export default mongoose.model("HospitalCard", hospitalCardSchema);
