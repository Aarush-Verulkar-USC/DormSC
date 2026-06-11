import dotenv from 'dotenv';
dotenv.config();

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`Missing required environment variable: ${name}`);
  return val;
}

export const env = {
  MONGODB_URI: requireEnv('MONGODB_URI'),
  JWT_SECRET: requireEnv('JWT_SECRET'),
  PORT: parseInt(process.env['PORT'] ?? '5000', 10),
  CLIENT_URL: process.env['CLIENT_URL'] ?? 'http://localhost:5173',
  ADMIN_EMAILS: (process.env['ADMIN_EMAILS'] ?? '').split(',').map(e => e.trim()).filter(Boolean),
  NODE_ENV: process.env['NODE_ENV'] ?? 'development',
};
