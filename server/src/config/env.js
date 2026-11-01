import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const isOrigin = (value) => {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol)
      && url.origin === value.replace(/\/$/, '')
      && !url.username
      && !url.password;
  } catch {
    return false;
  }
};

const origin = z.string().url().refine(isOrigin, 'Each client origin must be an origin URL without a path.');
const originList = z.string().optional().default('')
  .transform((value) => value.split(',').map((item) => item.trim()).filter(Boolean))
  .pipe(z.array(origin));

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  CLIENT_ORIGIN: origin.optional(),
  CLIENT_ORIGINS: originList,
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  FIREBASE_PROJECT_ID: z.string().optional().default(''),
  GOOGLE_APPLICATION_CREDENTIALS: z.string().optional().default(''),
});

const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
  const issues = parsedEnv.error.issues.map(({ path, message }) => `${path.join('.')}: ${message}`);
  throw new Error(`Invalid server environment:\n${issues.join('\n')}`);
}

const configuredOrigins = parsedEnv.data.CLIENT_ORIGINS.length
  ? parsedEnv.data.CLIENT_ORIGINS
  : parsedEnv.data.CLIENT_ORIGIN
    ? [parsedEnv.data.CLIENT_ORIGIN]
    : parsedEnv.data.NODE_ENV === 'development'
      ? ['http://localhost:5173']
      : [];

if (configuredOrigins.length === 0) {
  throw new Error('Set CLIENT_ORIGINS to a comma-separated list of deployed client origins.');
}

export const env = {
  ...parsedEnv.data,
  CLIENT_ORIGINS: [...new Set(configuredOrigins.map((value) => new URL(value).origin))],
};
