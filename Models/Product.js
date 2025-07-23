import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: { type: String, trim: true },
  rating: { type: Number, min: 1, max: 5 },
  comment: { type: String, trim: true },
  date: String,
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, default: 'Surgical Equipment', trim: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  description: { type: String, required: true, trim: true },
  details: { type: String, trim: true },
  material: { type: String, default: '', trim: true },
  dimensions: { type: String, default: '', trim: true },
  ventilation: { type: String, default: '', trim: true },
  reusable: { type: String, enum: ['Yes', 'No'], default: 'Yes' },
  images: [{ type: String, default: [] }],
  reviews: { type: [reviewSchema], default: [] },
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
