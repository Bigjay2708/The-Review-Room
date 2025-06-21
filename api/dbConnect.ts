// MongoDB connection utility for Vercel serverless functions
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables in case they haven't been loaded yet
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Connection options with timeouts and best practices
const options: mongoose.ConnectOptions = {
  bufferCommands: false,
  maxConnecting: 10,
  serverSelectionTimeoutMS: 10000, // 10 seconds
  socketTimeoutMS: 45000, // 45 seconds
};

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }
  
  if (!cached.promise) {
    const opts = options;    
    mongoose.set('strictQuery', true);
    
    cached.promise = mongoose.connect(MONGODB_URI as string, opts)
      .then((mongoose) => {
        console.log('MongoDB connection established successfully');
        return mongoose;
      })
      .catch((error) => {
        console.error('MongoDB connection error:', error);
        cached.promise = null; // Reset the promise so we can retry
        throw error;
      });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
  
  return cached.conn;
}

// Add a disconnection function for cleanup
export async function dbDisconnect() {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
  }
}

export default dbConnect;
