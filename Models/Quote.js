import mongoose from 'mongoose';

const quoteSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  product: String,
  quoteMessage: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Quote', quoteSchema);
