import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './user.model';

export interface IReview extends Document {
  _id: mongoose.Types.ObjectId;
  movieId: number;
  userId: mongoose.Types.ObjectId | IUser;
  rating: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    movieId: {
      type: Number,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
reviewSchema.index({ userId: 1 }); // Index for fetching reviews by user
// Compound index to ensure one review per user per movie
reviewSchema.index({ movieId: 1, userId: 1 }, { unique: true });

export const Review = mongoose.model<IReview>('Review', reviewSchema); 