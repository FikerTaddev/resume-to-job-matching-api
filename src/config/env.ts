import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(8080),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  API_KEY: z.string().min(1),
  HUGGINGFACE_API_KEY: z.string().min(1),
  UPTIME_SECRET: z.string().min(1),
  CACHE_TTL: z.coerce.number().default(1800),
  RATE_LIMIT_WINDOW: z.coerce.number().default(15),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  RENDER_EXTERNAL_URL: z.string().url().optional(),

  R2_ACCOUNT_ID: z.string().min(1),
  R2_ACCESS_KEY_ID: z.string().min(1),
  R2_SECRET_ACCESS_KEY: z.string().min(1),
  R2_BUCKET_NAME: z.string().min(1),
  R2_PUBLIC_URL: z.string().url().optional(),
});

export const env = envSchema.parse(process.env);
export type Env = z.infer<typeof envSchema>;
