import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import fs from 'fs'
import path from 'path'

export async function POST() {
  try {
    // Read and run exams migration
    const examsMigrationPath = path.join(process.cwd(), 'migrations', '001_update_exams_table.sql')
    const examsMigrationSQL = fs.readFileSync(examsMigrationPath, 'utf8')
    await sql`${examsMigrationSQL}`

    // Read and run resources migration
    const resourcesMigrationPath = path.join(process.cwd(), 'migrations', '002_create_resources_table.sql')
    const resourcesMigrationSQL = fs.readFileSync(resourcesMigrationPath, 'utf8')
    await sql`${resourcesMigrationSQL}`

    return NextResponse.json({ 
      success: true, 
      message: 'All database migrations completed successfully',
      migrations: ['exams_table_update', 'resources_table_create']
    })
  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Migration failed' 
    }, { status: 500 })
  }
}
