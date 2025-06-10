import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/user.model';

interface AuthRequest extends Request {
  user?: IUser;
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No authentication token, authorization denied.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    const user = await User.findOne({ _id: verified.id });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid.' });
  }
}; 