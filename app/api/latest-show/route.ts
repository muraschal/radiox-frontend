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
    
    // Return null if no supabase connection
    if (!supabase) {
      return NextResponse.json(null)
    }

    const { data: shows, error } = await supabase
      .from('broadcast_logs')
      .select(`
        *,
        show_presets!inner(
          display_name,
          description,
          city_focus,
          primary_speaker,
          secondary_speaker,
          gpt_selection_instructions
        )
      `)
      .not('script_content', 'is', null)
      .order('timestamp', { ascending: false })
      .limit(1)

    if (error) {
      console.error('Error loading latest show:', error)
      return NextResponse.json({ error: 'Failed to load latest show' }, { status: 500 })
    }

    const latestShow = shows?.[0] || null
    return NextResponse.json(latestShow)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 