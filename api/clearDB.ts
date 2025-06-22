import { Movie } from './models/movie.model';
import dbConnect from './dbConnect';

const clearDatabase = async () => {
  try {
    await dbConnect();
    console.log('Connected to MongoDB');
    
    const deleteResult = await Movie.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} movies from database`);
    
    console.log('Database cleared successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
};

clearDatabase();
