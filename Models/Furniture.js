import mongoose from 'mongoose';

const furnitureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String, // Only the filename is stored (not full URL)
    required: true,
  },
}, { timestamps: true });

const Furniture = mongoose.model('Furniture', furnitureSchema);

export default Furniture;
