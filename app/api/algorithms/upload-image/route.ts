import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authCookie = request.cookies.get('admin-auth')
    if (!authCookie || authCookie.value !== 'true') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, PNG, and WebP are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    // Generate filename
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const ext = path.extname(originalName) || '.jpg'
    const baseName = path.basename(originalName, ext)
    const fileName = `${baseName}_${timestamp}${ext}`

    // Ensure flowcharts directory exists
    const flowchartsDir = path.join(process.cwd(), 'public', 'flowcharts')
    await mkdir(flowchartsDir, { recursive: true })

    // Write file
    const filePath = path.join(flowchartsDir, fileName)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Return the public URL
    const imageUrl = `/flowcharts/${fileName}`

    return NextResponse.json({
      success: true,
      imageUrl,
      fileName
    })
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
  }
}
