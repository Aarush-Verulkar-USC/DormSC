import express from 'express';
import type { Server } from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './lib/env';
import { connectDB, disconnectDB, isDatabaseReady } from './lib/db';
import { errorHandler, HttpError } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import listingRoutes from './routes/listings';
import reviewRoutes from './routes/reviews';
import favoritesRoutes from './routes/favorites';
import adminRoutes from './routes/admin';
import chatRoutes from './routes/chat';

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || env.CLIENT_URLS.includes(origin.replace(/\/$/, ''))) {
        callback(null, true);
        return;
      }
      callback(new HttpError(403, 'Origin not allowed'));
    },
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: '32kb' }));
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

// Cheap, DB-free endpoint for the keep-warm ping (see .github/workflows/keep-warm.yml).
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, database: isDatabaseReady() ? 'connected' : 'connecting', uptime: process.uptime() });
});

app.get('/api/ready', (_req, res) => {
  if (!isDatabaseReady()) {
    res.status(503).setHeader('Retry-After', '2').json({ ok: false, database: 'connecting' });
    return;
  }
  res.json({ ok: true, database: 'connected' });
});

app.use('/api', (_req, res, next) => {
  if (!isDatabaseReady()) {
    res.status(503).setHeader('Retry-After', '2').json({ message: 'Service is starting. Please retry shortly.', code: 'SERVICE_STARTING' });
    return;
  }
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);

app.use('/api', (_req, res) => res.status(404).json({ message: 'API route not found' }));
app.use(errorHandler);

let shuttingDown = false;
let server: Server;

async function connectWithRetry(): Promise<void> {
  let delayMs = 1_000;
  while (!shuttingDown && !isDatabaseReady()) {
    try {
      await connectDB();
      return;
    } catch (err) {
      console.error('MongoDB connection error; retrying:', err);
      await new Promise(resolve => setTimeout(resolve, delayMs));
      delayMs = Math.min(delayMs * 2, 30_000);
    }
  }
}

async function shutdown(signal: string): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`${signal} received; shutting down`);
  server.close(async () => {
    await disconnectDB().catch(err => console.error('MongoDB disconnect error:', err));
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}

server = app.listen(env.PORT, () => {
  console.log(`Server listening on port ${env.PORT}`);
});
void connectWithRetry();

process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));
