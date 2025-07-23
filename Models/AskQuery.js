import mongoose from 'mongoose';

const askQuerySchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  query: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const AskQuery = mongoose.model('AskQuery', askQuerySchema);

export default AskQuery;
