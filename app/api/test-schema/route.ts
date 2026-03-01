import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    console.log('🔍 Checking jobs table schema...')
    
    // Get column information for the jobs table
    const columns = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'jobs'
      ORDER BY ordinal_position
    `
    
    console.log('📊 Jobs table columns:', columns)
    
    // Get a sample row to see what data actually exists
    const sampleRow = await sql`
      SELECT * FROM jobs LIMIT 1
    `
    
    console.log('📝 Sample row data:', sampleRow)
    
    return NextResponse.json({
      success: true,
      columns: columns,
      sampleRow: sampleRow,
      columnCount: columns.length
    })
  } catch (error) {
    console.error('❌ Schema check failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
