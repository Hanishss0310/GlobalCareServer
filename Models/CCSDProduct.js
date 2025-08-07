import mongoose from 'mongoose';

const CCSDProductSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
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
      type: String, // e.g., /uploads/filename.jpg
      default: '',   // Not required but defaults to empty
    },
  },
  {
    timestamps: true,
  }
);

// Optional: Prevent model overwrite in development (useful in serverless functions)
const CCSDProduct = mongoose.models.CCSDProduct || mongoose.model('CCSDProduct', CCSDProductSchema);

export default CCSDProduct;
