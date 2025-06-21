# The Review Room

A modern movie review platform built with the MERN stack, featuring movie information from TMDb and YouTube trailers.

## Features

- Browse movies with details from TMDb
- Read and write movie reviews
- Watch movie trailers via YouTube
- Rate and comment on movies
- User authentication and profiles
- Password reset functionality
- Responsive design with Material-UI

## Tech Stack

- **Frontend:** React (v19.1.0), TypeScript, Material-UI (MUI), React Router DOM, Axios, Emotion CSS-in-JS
- **Backend:** Node.js, Express.js, TypeScript, MongoDB, Mongoose ODM, JWT Authentication, bcryptjs
- **APIs & External Services:** TMDb API, YouTube Data API, Vercel Deployment
- **Development Tools:** Create React App, Jest, React Testing Library, Nodemon, ts-node
- **Security & Utilities:** CORS, dotenv, Web Vitals, Password Hashing, Helmet

## Project Structure

```
the-review-room/
├── api/              # Express.js backend with TypeScript
│   ├── middleware/   # Auth middleware and other middleware
│   ├── models/       # Mongoose models
│   ├── users/        # User-related routes
│   ├── movies/       # Movie-related routes
│   ├── reviews/      # Review-related routes
│   └── server.ts     # Main server file
├── frontend/         # React frontend with TypeScript
│   ├── public/       # Static files
│   └── src/          # Source code
│       ├── components/ # Reusable components
│       ├── hooks/      # Custom React hooks
│       ├── pages/      # Page components
│       ├── services/   # API services
│       └── types/      # TypeScript types
└── README.md         # Project documentation
```

## Environment Variables

### API

Create a `.env` file in the `/api` directory with the following variables:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000,https://your-production-domain.com
NODE_ENV=development
```

### Frontend

Create a `.env` file in the `/frontend` directory with the following variables:

```
REACT_APP_API_BASE_URL=http://localhost:5000/api
REACT_APP_TMDB_API_KEY=your_tmdb_api_key
```

## Getting Started

1. Clone the repository
2. Install dependencies:

   ```bash
   # Install backend dependencies
   cd api
   npm install

   # Install frontend dependencies
   cd frontend
   npm install
   ```

3. Start the development servers:

   ```bash
   # Start backend server
   cd api
   npm run dev

   # Start frontend server
   cd frontend
   npm start
   ```

4. Open http://localhost:3000 in your browser

## Deployment

### Deploying to Vercel

The API is configured to deploy to Vercel with the `vercel.json` configuration.

1. Install Vercel CLI: `npm install -g vercel`
2. Deploy API:
   ```bash
   cd api
   vercel
   ```
3. Deploy Frontend:
   ```bash
   cd frontend
   vercel
   ```

### Environment Variables in Production

Make sure to set the following environment variables in your production environment:

- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secure JWT secret key
- `CORS_ORIGIN`: Comma-separated list of allowed origins
- `REACT_APP_API_BASE_URL`: The URL of your deployed API
- `REACT_APP_TMDB_API_KEY`: Your TMDB API key

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Attribution

- Movie data provided by TMDb
- Trailers provided by YouTube
