import mongoose, { Document, Schema } from 'mongoose';

export interface IMovie {
  _id?: any;
  title: string;
  overview: string;
  release_date: string;
  poster_path?: string;
  tmdb_id?: number;
  vote_average?: number;
  vote_count?: number;
  popularity?: number;
}

const movieSchema = new Schema({
  title: { type: String, required: true },
  overview: { type: String, required: false, default: 'No overview available' },
  release_date: { type: String, required: true },
  poster_path: { type: String },
  tmdb_id: { type: Number, unique: true, sparse: true },
  vote_average: { type: Number },
  vote_count: { type: Number },
  popularity: { type: Number }
});

export const Movie = mongoose.models.Movie || mongoose.model('Movie', movieSchema);
