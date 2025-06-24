import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    return null
  }
  
  return createClient(supabaseUrl, supabaseKey)
}

export async function GET() {
  try {
    const supabase = getSupabaseClient()
    
    // Return mock data if no supabase connection
    if (!supabase) {
      return NextResponse.json([
        {
          id: '1',
          preset_name: 'zurich',
          display_name: 'Zurich Local News',
          description: 'Latest local news from Zurich and surrounding areas',
          city_focus: 'zurich',
          primary_speaker: 'marcel',
          secondary_speaker: 'jarvis',
          weather_speaker: 'lucy',
          gpt_selection_instructions: 'Focus on Zurich local news, politics, and culture.',
          rss_feed_filter: 'schweiz, zuerich, wetter, finanzen'
        },
        {
          id: '2',
          preset_name: 'news',
          display_name: 'Global News Hot',
          description: 'International breaking news from all perspectives',
          city_focus: 'global',
          primary_speaker: 'brad',
          secondary_speaker: 'lucy',
          gpt_selection_instructions: 'Focus on breaking international news and tech.',
          rss_feed_filter: 'international, wirtschaft, bitcoin, crypto, tech'
        }
      ])
    }

    const { data: presets, error } = await supabase
      .from('show_presets')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading show presets:', error)
      return NextResponse.json({ error: 'Failed to load presets' }, { status: 500 })
    }

    return NextResponse.json(presets || [])
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 