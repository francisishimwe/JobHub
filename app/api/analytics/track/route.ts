import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.page_url || !body.visitor_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const now = new Date().toISOString()

    // Insert page view
    const pageViewResult = await sql`
      INSERT INTO page_views (
        page_url,
        visitor_id,
        referrer,
        user_agent,
        country,
        device_type,
        browser,
        created_at
      ) VALUES (
        ${body.page_url},
        ${body.visitor_id},
        ${body.referrer || null},
        ${body.user_agent || null},
        ${body.country || 'Unknown'},
        ${body.device_type || 'Unknown'},
        ${body.browser || 'Unknown'},
        ${now}
      )
      RETURNING *
    `

    // Check if visitor exists
    const visitorCheck = await sql`
      SELECT * FROM visitors WHERE visitor_id = ${body.visitor_id}
    `

    if (visitorCheck.length > 0) {
      // Update existing visitor
      await sql`
        UPDATE visitors
        SET last_visit = ${now}, visit_count = visit_count + 1
        WHERE visitor_id = ${body.visitor_id}
      `
    } else {
      // Create new visitor
      const visitorId = crypto.randomUUID()
      await sql`
        INSERT INTO visitors (
          id,
          visitor_id,
          country,
          device_type,
          browser,
          first_visit,
          last_visit,
          visit_count,
          created_at
        ) VALUES (
          ${visitorId},
          ${body.visitor_id},
          ${body.country || 'Unknown'},
          ${body.device_type || 'Unknown'},
          ${body.browser || 'Unknown'},
          ${now},
          ${now},
          1,
          ${now}
        )
      `
    }

    return NextResponse.json(pageViewResult[0], { status: 201 })
  } catch (error) {
    console.error('Error tracking page view:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to track page view' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const visitorId = searchParams.get('visitorId')

    if (visitorId) {
      // Get visitor data
      const visitor = await sql`
        SELECT * FROM visitors WHERE visitor_id = ${visitorId}
      `
      return NextResponse.json(visitor.length > 0 ? visitor[0] : null)
    }

    // Get analytics summary for current month
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const viewsResult = await sql`
      SELECT COUNT(*) as count FROM page_views WHERE created_at >= ${startOfMonth.toISOString()}
    `

    const visitorsResult = await sql`
      SELECT COUNT(*) as count FROM visitors WHERE first_visit >= ${startOfMonth.toISOString()}
    `

    const countriesResult = await sql`
      SELECT country, COUNT(*) as count FROM page_views 
      WHERE created_at >= ${startOfMonth.toISOString()} AND country IS NOT NULL
      GROUP BY country
    `

    const devicesResult = await sql`
      SELECT device_type, COUNT(*) as count FROM page_views
      WHERE created_at >= ${startOfMonth.toISOString()}
      GROUP BY device_type
    `

    const browsersResult = await sql`
      SELECT browser, COUNT(*) as count FROM page_views
      WHERE created_at >= ${startOfMonth.toISOString()}
      GROUP BY browser
    `

    return NextResponse.json({
      views: viewsResult[0]?.count || 0,
      visitors: visitorsResult[0]?.count || 0,
      countries: countriesResult || [],
      devices: devicesResult || [],
      browsers: browsersResult || []
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
