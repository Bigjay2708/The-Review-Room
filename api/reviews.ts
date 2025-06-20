import type { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../api/dbConnect';
import { Review } from '../api/models/review.model';

// Example: GET /api/reviews?movieId=123
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
      const { movieId } = req.query;
      if (!movieId) return res.status(400).json({ error: 'movieId is required' });
      const reviews = await Review.find({ movieId: Number(movieId) });
      return res.status(200).json(reviews);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
