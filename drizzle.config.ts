import { defineConfig } from 'drizzle-kit'

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set')
const url = process.env.DATABASE_URL.replace(/\${([A-Z_]+)}/g, (_, $1) => process.env[$1]!)

export default defineConfig({
  schema: './src/lib/server/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: { url },
  verbose: true,
  strict: true,
})
