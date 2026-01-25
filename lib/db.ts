import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.NEON_DATABASE_URL || process.env.POSTGRES_URL!)

export { sql }
