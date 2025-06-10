export interface User {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  genres?: {
    id: number;
    name: string;
  }[];
}

export interface Review {
  _id: string;
  movieId: number;
  userId: string;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  movie?: Movie;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  username: string;
}

export interface ReviewFormData {
  movieId: number;
  rating: number;
  content: string;
}

export interface UpdateReviewData {
  rating: number;
  content: string;
} 