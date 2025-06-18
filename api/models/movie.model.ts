import mongoose, { Document, Schema } from 'mongoose';

export interface IMovie extends Document {
  // Define your movie fields here (example)
  title: string;
  overview: string;
  release_date: string;
  poster_path?: string;
  // ...add other fields as needed
}

const movieSchema = new Schema<IMovie>({
  title: { type: String, required: true },
  overview: { type: String, required: true },
  release_date: { type: String, required: true },
  poster_path: { type: String },
  // ...add other fields as needed
});

export const Movie = mongoose.models.Movie || mongoose.model<IMovie>('Movie', movieSchema);
