import mongoose from 'mongoose';

const CCSDProductSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    specialties: {
      type: [String],
      default: [],
    },
    features: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const CCSDProduct = mongoose.model('CCSDProduct', CCSDProductSchema);

export default CCSDProduct;
