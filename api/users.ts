import type { VercelRequest, VercelResponse } from '@vercel/node';
import dbConnect from '../api/dbConnect';
import { User } from '../api/models/user.model';

// Example: GET /api/users?username=foo
export default async function handler(req: VercelRequest, res: VercelResponse) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const { username } = req.query;
      if (!username) return res.status(400).json({ error: 'username is required' });
      const user = await User.findOne({ username });
      if (!user) return res.status(404).json({ error: 'User not found' });
      return res.status(200).json(user);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
