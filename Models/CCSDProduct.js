const mongoose = require('mongoose');

const CCSDProductSchema = new mongoose.Schema({
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
    type: String, // Store image URL or file path
    required: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('CCSDProduct', CCSDProductSchema);
