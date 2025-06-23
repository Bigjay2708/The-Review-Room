// index.ts - Entry point for Vercel
import express, { Request, Response } from 'express';
import './server';

// Create a simple express app for Vercel
const app = express();

// Basic health check endpoint for Vercel
app.get('/api/vercel-health', (req: Request, res: Response) => {
  res.json({ status: 'ok', provider: 'vercel' });
});

export default app;
