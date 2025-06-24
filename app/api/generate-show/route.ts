import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { preset = 'zurich', duration_minutes = 3 } = body

    // Call the backend show service
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8001'
    
    const response = await fetch(`${backendUrl}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        preset,
        duration_minutes,
        target_hour: new Date().toLocaleTimeString('de-DE', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      })
    })

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`)
    }

    const showData = await response.json()

    // Generate audio if script was created successfully
    if (showData.script_content) {
      const audioResponse = await fetch(`${process.env.AUDIO_SERVICE_URL || 'http://localhost:8003'}/script`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          script_content: showData.script_content,
          session_id: showData.session_id,
          voice_quality: 'ultra',
          include_music: true,
          export_format: 'mp3'
        })
      })

      if (audioResponse.ok) {
        const audioData = await audioResponse.json()
        showData.audio_file = audioData.audio_file
        showData.audio_duration = audioData.duration_seconds
      }
    }

    return NextResponse.json({
      success: true,
      data: showData
    })

  } catch (error) {
    console.error('Show generation failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
} 