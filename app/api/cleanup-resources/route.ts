import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function POST() {
  try {
    // Get all resources to identify duplicates
    const allResources = await sql`
      SELECT id, title, COUNT(*) as count 
      FROM resources 
      WHERE title IN ('Job Prep Questions & Answers', 'Interview Questions & Answers')
      GROUP BY id, title
      ORDER BY id
    `

    console.log('Current resources:', allResources)

    // Keep only the first occurrence of each title (lowest ID)
    const duplicateIds = allResources
      .filter(resource => resource.count > 1)
      .map(resource => resource.id)
      .slice(1) // Keep the first one (lowest ID), remove the rest

    console.log('Duplicate IDs to remove:', duplicateIds)

    if (duplicateIds.length > 0) {
      // Remove duplicates
      await sql`
        DELETE FROM resources 
        WHERE id = ANY(${duplicateIds})
      `
      
      console.log(`Removed ${duplicateIds.length} duplicate resources`)
    }

    // Verify cleanup
    const finalResources = await sql`
      SELECT title, button_text, button_link 
      FROM resources 
      WHERE title IN ('Job Prep Questions & Answers', 'Interview Questions & Answers')
      ORDER BY sort_order ASC, created_at DESC
    `

    return NextResponse.json({ 
      success: true, 
      message: `Cleaned up ${duplicateIds.length} duplicate resources`,
      remaining: finalResources.length,
      resources: finalResources
    })
  } catch (error) {
    console.error('Cleanup error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to cleanup resources'
    }, { status: 500 })
  }
}
