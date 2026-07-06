import mongoose from 'mongoose';
import dotenv   from 'dotenv';
import app      from './app.js';

dotenv.config();

const PORT       = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

const startServer = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(' MongoDB connected successfully');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    });
  } catch (error) {
    console.error(' Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
};

startServer();