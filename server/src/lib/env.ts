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
  CLIENT_URLS: (process.env['CLIENT_URL'] ?? 'http://localhost:5173')
    .split(',')
    .map(url => url.trim().replace(/\/$/, ''))
    .filter(Boolean),
  ADMIN_EMAILS: (process.env['ADMIN_EMAILS'] ?? '').split(',').map(e => e.trim()).filter(Boolean),
  NODE_ENV: process.env['NODE_ENV'] ?? 'development',
  OPENAI_API_KEY: process.env['OPENAI_API_KEY']?.trim() || undefined,
  OPENAI_MODEL: process.env['OPENAI_MODEL']?.trim() || 'gpt-4o-mini',
};
