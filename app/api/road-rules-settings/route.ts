import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function GET(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Create road_rules_settings table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS road_rules_settings (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        system_enabled BOOLEAN DEFAULT true,
        default_access_days INTEGER DEFAULT 30,
        max_attempts_per_exam INTEGER DEFAULT 3,
        passing_score INTEGER DEFAULT 70,
        admin_contact_phone TEXT DEFAULT '+250 783 074 056',
        system_maintenance BOOLEAN DEFAULT false,
        auto_expire_users BOOLEAN DEFAULT true,
        notification_enabled BOOLEAN DEFAULT true,
        exam_timeout_minutes INTEGER DEFAULT 20,
        welcome_message TEXT DEFAULT 'Murakaza neza kuri Rwanda Job Hub!',
        payment_instructions TEXT DEFAULT 'Kugirango wemererwe gukora ano masuzumabumenyi, urasabwa kwishyura 1000 Rwf.',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Get existing settings
    const settings = await sql`
      SELECT * FROM road_rules_settings 
      ORDER BY created_at DESC 
      LIMIT 1
    `

    return NextResponse.json({
      success: true,
      settings: settings[0] || {
        system_enabled: true,
        default_access_days: 30,
        max_attempts_per_exam: 3,
        passing_score: 70,
        admin_contact_phone: "+250 783 074 056",
        system_maintenance: false,
        auto_expire_users: true,
        notification_enabled: true,
        exam_timeout_minutes: 20,
        welcome_message: "Murakaza neza kuri Rwanda Job Hub!",
        payment_instructions: "Kugirango wemererwe gukora ano masuzumabumenyi, urasabwa kwishyura 1000 Rwf."
      }
    })
  } catch (error) {
    console.error('Fetch road rules settings error:', error)
    return NextResponse.json(
      { success: false, message: "Ikibazo gikomeye serivisi" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const body = await request.json()

    const {
      system_enabled,
      default_access_days,
      max_attempts_per_exam,
      passing_score,
      admin_contact_phone,
      system_maintenance,
      auto_expire_users,
      notification_enabled,
      exam_timeout_minutes,
      welcome_message,
      payment_instructions
    } = body

    // Create table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS road_rules_settings (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        system_enabled BOOLEAN DEFAULT true,
        default_access_days INTEGER DEFAULT 30,
        max_attempts_per_exam INTEGER DEFAULT 3,
        passing_score INTEGER DEFAULT 70,
        admin_contact_phone TEXT DEFAULT '+250 783 074 056',
        system_maintenance BOOLEAN DEFAULT false,
        auto_expire_users BOOLEAN DEFAULT true,
        notification_enabled BOOLEAN DEFAULT true,
        exam_timeout_minutes INTEGER DEFAULT 20,
        welcome_message TEXT DEFAULT 'Murakaza neza kuri Rwanda Job Hub!',
        payment_instructions TEXT DEFAULT 'Kugirango wemererwe gukora ano masuzumabumenyi, urasabwa kwishyura 1000 Rwf.',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Check if settings exist
    const existing = await sql`
      SELECT id FROM road_rules_settings 
      ORDER BY created_at DESC 
      LIMIT 1
    `

    let result
    if (existing.length > 0) {
      // Update existing settings
      result = await sql`
        UPDATE road_rules_settings 
        SET 
          system_enabled = ${system_enabled},
          default_access_days = ${default_access_days},
          max_attempts_per_exam = ${max_attempts_per_exam},
          passing_score = ${passing_score},
          admin_contact_phone = ${admin_contact_phone},
          system_maintenance = ${system_maintenance},
          auto_expire_users = ${auto_expire_users},
          notification_enabled = ${notification_enabled},
          exam_timeout_minutes = ${exam_timeout_minutes},
          welcome_message = ${welcome_message},
          payment_instructions = ${payment_instructions},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${existing[0].id}
        RETURNING *
      `
    } else {
      // Insert new settings
      result = await sql`
        INSERT INTO road_rules_settings (
          system_enabled, default_access_days, max_attempts_per_exam, passing_score,
          admin_contact_phone, system_maintenance, auto_expire_users, notification_enabled,
          exam_timeout_minutes, welcome_message, payment_instructions
        ) VALUES (
          ${system_enabled}, ${default_access_days}, ${max_attempts_per_exam}, ${passing_score},
          ${admin_contact_phone}, ${system_maintenance}, ${auto_expire_users}, ${notification_enabled},
          ${exam_timeout_minutes}, ${welcome_message}, ${payment_instructions}
        )
        RETURNING *
      `
    }

    return NextResponse.json({
      success: true,
      settings: result[0],
      message: "Igenamirongo ryahinduwe neza!"
    })
  } catch (error) {
    console.error('Save road rules settings error:', error)
    return NextResponse.json(
      { success: false, message: "Ikibazo gikomeye serivisi" },
      { status: 500 }
    )
  }
}
