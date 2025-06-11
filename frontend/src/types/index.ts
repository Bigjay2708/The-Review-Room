export interface Movie {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  genres?: Array<{ id: number; name: string }>;
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