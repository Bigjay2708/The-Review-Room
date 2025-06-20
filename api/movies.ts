import type { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../api/dbConnect';
import { Movie } from './models/movie.model';

// Example: GET /api/movies
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  await dbConnect();

  if (req.method === 'GET') {
    try {
      // Fetch movies from your database (adjust as needed)
      const movies = await Movie.find({});
      return res.status(200).json(movies);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
