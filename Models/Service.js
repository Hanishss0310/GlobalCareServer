// In Models/Service.js
import mongoose from 'mongoose';
const serviceSchema = new mongoose.Schema({
  title: String,
  description: String,
  images: [String],
  brochure: String,
  specs: [{ title: String, value: String }],
  features: [String],
  reviews: [
    {
      name: String,
      comment: String,
      rating: Number,
      date: String,
    },
  ],
}, { timestamps: true });

export default mongoose.model('Service', serviceSchema);
