import mongoose from 'mongoose';
import { config } from './server.config.js';

export default async function connectDB() {
  await mongoose.connect(config.mongoUri);
  console.log('MongoDB connected');
}
