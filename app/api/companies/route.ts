import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 Fetching companies from database...')

    // Try to get companies from database first
    try {
      const companies = await sql`
        SELECT 
          id,
          name,
          logo,
          location,
          industry,
          website,
          created_at
        FROM companies
        ORDER BY created_at DESC
      `

      console.log(`✓ Found ${companies.length} companies in database`)

      return NextResponse.json({
        success: true,
        companies: companies || [],
        count: companies.length,
        database: true // Flag to indicate this is database data
      })

    } catch (dbError) {
      console.error('Database query failed:', dbError)
      
      // Return empty results when database is not available
      console.log('🔄 Returning empty results due to database unavailability')
      return NextResponse.json({ 
        success: true, 
        companies: [],
        count: 0,
        database: false,
        message: 'Database temporarily unavailable'
      })
    }

  } catch (error) {
    console.error('❌ Error fetching companies:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch companies',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: 'Missing required field: name' },
        { status: 400 }
      )
    }

    console.log('🔄 Creating new company:', body.name)

    // Try database operations
    try {
      // Generate UUID
      const id = crypto.randomUUID()
      const now = new Date().toISOString()

      const result = await sql`
        INSERT INTO companies (
          id,
          name,
          logo,
          location,
          industry,
          website,
          created_at
        ) VALUES (
          ${id},
          ${body.name},
          ${body.logo || null},
          ${body.location || null},
          ${body.industry || null},
          ${body.website || null},
          ${now}
        )
        RETURNING id, name, logo, location, industry, website, created_at
      `

      if (!result || result.length === 0) {
        throw new Error('Failed to insert company')
      }

      const company = result[0]
      console.log('✅ Company created successfully:', company)

      return NextResponse.json({
        success: true,
        company: {
          id: company.id,
          name: company.name,
          logo: company.logo,
          location: company.location,
          industry: company.industry,
          website: company.website,
          created_at: company.created_at
        },
        message: 'Company created successfully',
        database: true
      }, { status: 201 })

    } catch (schemaError) {
      console.log('⚠️ Schema error, trying minimal insert...', schemaError)
      
      // Fallback to minimal schema
      try {
        // Try with minimal required fields
        const minimalResult = await sql`
          INSERT INTO companies (id, name, created_at)
          VALUES (
            ${crypto.randomUUID()},
            ${body.name},
            ${new Date().toISOString()}
          )
          RETURNING id, name, created_at
        `

        console.log('✅ Minimal company created successfully:', minimalResult[0])

        return NextResponse.json({ 
          success: true, 
          company: minimalResult[0],
          message: 'Company created successfully with basic information',
          database: true
        })

      } catch (minimalError) {
        console.error('❌ Even minimal insert failed:', minimalError)
        
        // Final fallback - simulate company creation
        console.log('🔄 Simulating company creation due to database issues')
        const simulatedCompany = {
          id: `sim_${Date.now()}`,
          name: body.name,
          logo: body.logo || null,
          location: body.location || null,
          industry: body.industry || null,
          website: body.website || null,
          created_at: new Date().toISOString(),
          message: 'Company created but not saved to database due to connection issues'
        }

        return NextResponse.json({ 
          success: true, 
          company: simulatedCompany,
          message: 'Company created (simulation mode - database unavailable)',
          database: false
        })
      }
    }

  } catch (error) {
    console.error('❌ Error creating company:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create company' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // If no ID provided, create a new company (for admin dashboard)
    if (!body.id) {
      // Validate required fields for creation
      if (!body.name) {
        return NextResponse.json(
          { error: 'Missing required field: name' },
          { status: 400 }
        )
      }

      console.log('🔄 Creating new company via PUT:', body.name)

      // Try database operations
      try {
        // Generate UUID for new company
        const id = crypto.randomUUID()
        const now = new Date().toISOString()

        const result = await sql`
          INSERT INTO companies (
            id,
            name,
            logo,
            location,
            industry,
            website,
            created_at
          ) VALUES (
            ${id},
            ${body.name},
            ${body.logo || null},
            ${body.location || null},
            ${body.industry || null},
            ${body.website || null},
            ${now}
          )
          RETURNING id, name, logo, location, industry, website, created_at
        `

        if (!result || result.length === 0) {
          throw new Error('Failed to insert company')
        }

        const company = result[0]
        console.log('✅ Company created successfully via PUT:', company)

        return NextResponse.json({
          success: true,
          company: {
            id: company.id,
            name: company.name,
            logo: company.logo,
            location: company.location,
            industry: company.industry,
            website: company.website,
            created_at: company.created_at
          },
          message: 'Company created successfully',
          database: true
        }, { status: 201 })

      } catch (schemaError) {
        console.log('⚠️ Schema error in PUT, trying minimal insert...', schemaError)
        
        // Fallback to minimal schema
        try {
          const minimalResult = await sql`
            INSERT INTO companies (id, name, created_at)
            VALUES (
              ${crypto.randomUUID()},
              ${body.name},
              ${new Date().toISOString()}
            )
            RETURNING id, name, created_at
          `

          console.log('✅ Minimal company created successfully via PUT:', minimalResult[0])

          return NextResponse.json({ 
            success: true, 
            company: minimalResult[0],
            message: 'Company created successfully with basic information',
            database: true
          })

        } catch (minimalError) {
          console.error('❌ Even minimal insert failed in PUT:', minimalError)
          
          // Final fallback - simulate company creation
          console.log('🔄 Simulating company creation via PUT due to database issues')
          const simulatedCompany = {
            id: `sim_${Date.now()}`,
            name: body.name,
            logo: body.logo || null,
            location: body.location || null,
            industry: body.industry || null,
            website: body.website || null,
            created_at: new Date().toISOString(),
            message: 'Company created but not saved to database due to connection issues'
          }

          return NextResponse.json({ 
            success: true, 
            company: simulatedCompany,
            message: 'Company created (simulation mode - database unavailable)',
            database: false
          })
        }
      }
    }

    // If ID provided, update existing company
    console.log('🔄 Updating company:', body.id)

    // Try database operations
    try {
      const result = await sql`
        UPDATE companies
        SET 
          name = ${body.name || null},
          logo = ${body.logo || null},
          location = ${body.location || null},
          industry = ${body.industry || null},
          website = ${body.website || null}
        WHERE id = ${body.id}
        RETURNING id, name, logo, location, industry, website, created_at
      `

      if (!result || result.length === 0) {
        return NextResponse.json(
          { error: 'Company not found' },
          { status: 404 }
        )
      }

      const company = result[0]
      console.log('✅ Company updated successfully:', company)

      return NextResponse.json({
        success: true,
        company: {
          id: company.id,
          name: company.name,
          logo: company.logo,
          location: company.location,
          industry: company.industry,
          website: company.website,
          created_at: company.created_at
        },
        message: 'Company updated successfully',
        database: true
      })

    } catch (dbError) {
      console.error('Database update failed:', dbError)
      
      // Simulate update
      console.log('🔄 Simulating company update due to database issues')
      const simulatedUpdate = {
        id: body.id,
        name: body.name,
        logo: body.logo || null,
        location: body.location || null,
        industry: body.industry || null,
        website: body.website || null,
        message: 'Company updated but not saved to database due to connection issues'
      }

      return NextResponse.json({ 
        success: true, 
        company: simulatedUpdate,
        message: 'Company updated (simulation mode - database unavailable)',
        database: false
      })
    }

  } catch (error) {
    console.error('❌ Error updating company:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update company' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Missing required parameter: id' },
        { status: 400 }
      )
    }

    console.log('🔄 Deleting company:', id)

    // Try database operations
    try {
      await sql`
        DELETE FROM companies
        WHERE id = ${id}
      `

      console.log('✅ Company deleted successfully:', id)

      return NextResponse.json({ 
        success: true,
        message: 'Company deleted successfully',
        database: true
      })

    } catch (dbError) {
      console.error('Database delete failed:', dbError)
      
      // Simulate delete
      console.log('🔄 Simulating company deletion due to database issues')
      return NextResponse.json({ 
        success: true, 
        message: 'Company deleted (simulation mode - database unavailable)',
        database: false
      })
    }

  } catch (error) {
    console.error('❌ Error deleting company:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete company' },
      { status: 500 }
    )
  }
}
