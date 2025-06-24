import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { script_content, session_id, voice_quality = 'high' } = body

    if (!script_content) {
      return NextResponse.json(
        { error: 'Script content is required' },
        { status: 400 }
      )
    }

    // Call the backend audio service
    const audioServiceUrl = process.env.AUDIO_SERVICE_URL || 'http://localhost:8003'
    
    const response = await fetch(`${audioServiceUrl}/script`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        script_content,
        session_id: session_id || `frontend_${Date.now()}`,
        voice_quality,
        export_format: 'mp3',
        include_music: false
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Audio service error: ${response.status} - ${errorText}`)
    }

    const audioData = await response.json()

    if (audioData.success && audioData.audio_file) {
      // Extract filename from full path
      const filename = audioData.audio_file.split('/').pop()
      
      return NextResponse.json({
        success: true,
        audio_filename: filename,
        session_id: audioData.session_id,
        duration_seconds: audioData.duration_seconds,
        file_size_bytes: audioData.file_size_bytes,
        segments_count: audioData.segments_count
      })
    } else {
      throw new Error('Audio generation failed')
    }

  } catch (error) {
    console.error('Audio generation failed:', error)
    return NextResponse.json(
      { error: `Audio generation failed: ${error}` },
      { status: 500 }
    )
  }
} 