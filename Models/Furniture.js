// models/Furniture.js

import mongoose from 'mongoose';

const furnitureSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String, required: true },

    // Add these fields:
    length: { type: String },
    width: { type: String },
    height: { type: String },
    material: { type: String },
    specifications: [String], // <-- this is for the specs textarea array
  },
  { timestamps: true }
);

const Furniture = mongoose.model('Furniture', furnitureSchema);

export default Furniture;
