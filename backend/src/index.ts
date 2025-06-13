import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 5000;

// Minimal /ping route for testing
app.get('/ping', (req: Request, res: Response) => {
  res.json({ message: 'pong', time: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Minimal test server running on port ${PORT}`);
});