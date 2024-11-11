// config.ts
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
  BASE_DIR: z.string().default('./example'),
  ANTHROPIC_API_KEY: z.string(),
  ANTHROPIC_MODEL: z.string().default('claude-3-5-sonnet-20240620'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

export const config = configSchema.parse(process.env);
