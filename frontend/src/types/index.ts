export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  
  // Optional properties that might not be in all API responses
  adult?: boolean;
  genre_ids?: number[];
  original_language?: string;
  original_title?: string;
  popularity?: number;
  video?: boolean;
  vote_count?: number;
  genres?: Array<{ id: number; name: string }>;
  runtime?: number;
  tagline?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Review {
  _id: string;
  userId: string;
  movieId: number;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  username: string;
}

export interface ReviewFormData {
  movieId: number;
  rating: number;
  comment: string;
}

export interface UpdateReviewData {
  rating?: number;
  comment?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}