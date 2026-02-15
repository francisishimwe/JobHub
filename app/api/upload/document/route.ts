import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

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

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      console.log('❌ File too large:', file.size, 'bytes')
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      )
    }

    console.log('✅ File validation passed, starting upload process')
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Create a clean filename with timestamp
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `job-doc-${timestamp}-${originalName}`
    console.log('🔍 Generated filename:', fileName)
    
    // Save to uploads directory
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    console.log('🔍 Uploads directory:', uploadsDir)
    
    if (!existsSync(uploadsDir)) {
      console.log('🔍 Creating uploads directory...')
      await mkdir(uploadsDir, { recursive: true })
      console.log('✅ Uploads directory created')
    }
    
    const filePath = join(uploadsDir, fileName)
    console.log('🔍 Saving file to:', filePath)
    
    await writeFile(filePath, buffer)
    console.log('✅ File saved successfully')

    const response = NextResponse.json({ 
      success: true,
      url: `/uploads/${fileName}`,
      originalName: file.name
    })
    console.log('✅ Upload response:', { success: true, url: `/uploads/${fileName}` })
    
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
