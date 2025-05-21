import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'mock', 'test']),
  ANTHROPIC_API_KEY: z.string(),
})

const parsedEnv = envSchema.safeParse({
  NODE_ENV: import.meta.env.MODE,
  ANTHROPIC_API_KEY: import.meta.env.VITE_ANTHROPIC_API_KEY,
})

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', parsedEnv.error.format())
  throw new Error('Invalid environment variables')
}

export const env = parsedEnv.data
