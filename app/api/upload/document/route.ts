import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Document upload request received')
    const formData = await request.formData()
    console.log('🔍 FormData keys:', Array.from(formData.keys()))
    const file = formData.get('document') as File | null
    console.log('🔍 File received:', file ? `${file.name} (${file.size} bytes, ${file.type})` : 'null')

    if (!file) {
      console.log('❌ No file found in FormData')
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      console.log('❌ Invalid file type:', file.type)
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      )
    }

    // Validate file size (5MB max for base64)
    if (file.size > 5 * 1024 * 1024) {
      console.log('❌ File too large:', file.size, 'bytes')
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      )
    }

    console.log('✅ File validation passed, converting to base64')
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64String = buffer.toString('base64')
    
    // Create a clean filename with timestamp
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `job-doc-${timestamp}-${originalName}`
    console.log('🔍 Generated filename:', fileName)
    
    // Create data URL that can be stored and used directly
    const dataUrl = `data:application/pdf;base64,${base64String}`
    console.log('✅ Base64 conversion completed')

    const response = NextResponse.json({ 
      success: true,
      url: dataUrl, // Store the full data URL
      originalName: file.name,
      fileName: fileName
    })
    console.log('✅ Upload response:', { success: true, fileName })
    
    return response

  } catch (error) {
    console.error('❌ Document upload error:', error)
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack available')
    return NextResponse.json(
      { error: 'Failed to upload document', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
