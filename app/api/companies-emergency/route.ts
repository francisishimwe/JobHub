import { NextResponse } from 'next/server'

export async function GET() {
  const emergencyCompanies = [
    { id: '1', name: 'Tech Solutions Rwanda', location: 'Kigali, Rwanda', industry: 'Technology' },
    { id: '2', name: 'Digital Agency Ltd', location: 'Kigali, Rwanda', industry: 'Digital Marketing' },
    { id: '3', name: 'Rwanda Innovations', location: 'Kigali, Rwanda', industry: 'Software Development' },
    { id: '4', name: 'Creative Studio', location: 'Kigali, Rwanda', industry: 'Design' },
    { id: '5', name: 'Mobile First Inc', location: 'Kigali, Rwanda', industry: 'Mobile Development' }
  ]

  return NextResponse.json({
    companies: emergencyCompanies
  })
}
