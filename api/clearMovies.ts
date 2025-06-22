import mongoose from 'mongoose';
import { Movie } from './models/movie.model';

const connectToDatabase = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/thereviewroom';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export const clearMovies = async () => {
  try {
    await connectToDatabase();
    await Movie.deleteMany({});
    console.log('All movies cleared from database');
  } catch (error) {
    console.error('Error clearing movies:', error);
  } finally {
    await mongoose.disconnect();
  }
};

clearMovies().then(() => process.exit(0));
