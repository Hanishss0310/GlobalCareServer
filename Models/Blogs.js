// Models/Blogs.js

import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: String,
  tagline: String,
  dateTime: String,
  location: String,
  mapLink: String,
  image: String,
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
