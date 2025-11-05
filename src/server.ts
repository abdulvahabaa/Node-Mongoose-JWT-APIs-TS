import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import userRoutes from './routes/user.routes.js';
import { errorHandler } from './middleware/error.middleware.js';

dotenv.config();

const app = express();
app.use(express.json());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined')); // Better log format for production
}

// Routes
app.use('/api/users', userRoutes);

// Error Middleware
app.use(errorHandler);

// Start server after DB connects
const PORT = process.env.PORT || 5000;

await connectDB();

app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`),
);
