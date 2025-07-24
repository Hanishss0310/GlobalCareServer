// Models/Service.js
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  comment: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  date: { type: String, required: true }, // Could also use `type: Date` if storing as ISO
});

const specSchema = new mongoose.Schema({
  title: { type: String, required: true },
  value: { type: String, required: true },
});

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: [{ type: String }],
  brochure: { type: String },
  specs: [specSchema],
  features: [{ type: String }],
  reviews: [reviewSchema],
}, { timestamps: true });

export default mongoose.model('Service', serviceSchema);
