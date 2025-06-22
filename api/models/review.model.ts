import mongoose, { Document, Schema } from 'mongoose';

export interface IReview {
  _id?: any;
  userId: string;
  movieId: number;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  username: string;
}

const reviewSchema = new Schema({
  userId: { type: String, required: true },
  movieId: { type: Number, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true },
  username: { type: String, required: true },
});

export const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
