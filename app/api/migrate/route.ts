import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import fs from 'fs'
import path from 'path'

export async function POST() {
  try {
    // Read the migration file
    const migrationPath = path.join(process.cwd(), 'migrations', '001_update_exams_table.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')

    // Execute the migration
    await sql`${migrationSQL}`

    return NextResponse.json({ 
      success: true, 
      message: 'Exams table migration completed successfully' 
    })
  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Migration failed' 
    }, { status: 500 })
  }
}
