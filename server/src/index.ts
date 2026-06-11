import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './lib/env';
import { connectDB } from './lib/db';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import listingRoutes from './routes/listings';
import reviewRoutes from './routes/reviews';
import favoritesRoutes from './routes/favorites';
import adminRoutes from './routes/admin';
import chatRoutes from './routes/chat';

const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);

app.use(errorHandler);

connectDB().then(() => {
  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
});
