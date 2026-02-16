import { neon as neonFactory } from '@neondatabase/serverless'

let sqlCache: any = null

function getSql() {
  if (sqlCache) return sqlCache
  
  const connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || process.env.POSTGRES_URL
  if (!connectionString) {
    throw new Error('Database connection string not found. Make sure DATABASE_URL, NEON_DATABASE_URL, or POSTGRES_URL is set in your environment variables.')
  }
  
  try {
    sqlCache = neonFactory(connectionString)
    return sqlCache
  } catch (error) {
    throw new Error(`Failed to initialize database connection: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Use a getter that will lazily initialize on first access
class SqlQuery {
  constructor(private strings: TemplateStringsArray, private values: any[]) {}
  
  async execute() {
    const sqlFn = getSql()
    return sqlFn(this.strings, ...this.values)
  }
}

// Return a tagged template function that lazily initializes
export function sql(strings: TemplateStringsArray, ...values: any[]) {
  const sqlFn = getSql()
  return sqlFn(strings, ...values)
}

// Export the getSql function for direct access
export { getSql }
