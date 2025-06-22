import mongoose, { Document, Schema } from 'mongoose';

export interface IMovie extends Document {
  id?: number; 
  title: string;
  overview?: string;
  release_date: string;
  poster_path?: string;
  backdrop_path?: string;
  tmdb_id: number;
  vote_average?: number;
  vote_count?: number;
  popularity?: number;
  adult?: boolean;
  genre_ids?: number[];
  original_language?: string;
  original_title?: string;
  video?: boolean;
}

const movieSchema = new Schema({
  id: { type: Number }, 
  title: { type: String, required: true },
  overview: { type: String, required: false, default: 'No overview available' },
  release_date: { type: String, required: true },
  poster_path: { type: String },
  backdrop_path: { type: String },
  tmdb_id: { type: Number, unique: true, required: true },
  vote_average: { type: Number, default: 0 },
  vote_count: { type: Number, default: 0 },
  popularity: { type: Number, default: 0 },
  adult: { type: Boolean, default: false },
  genre_ids: [{ type: Number }],
  original_language: { type: String },
  original_title: { type: String },
  video: { type: Boolean, default: false }
}, { timestamps: true });

export const Movie = mongoose.model('Movie', movieSchema);
