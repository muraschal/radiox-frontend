import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// 🔥 OPTIMIZED: Production-ready Supabase client configuration
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // No authentication needed for read-only access
    autoRefreshToken: false,
  },
  realtime: {
    // 🔥 OPTIMIZATION: Disable realtime for performance (enable if needed)
    params: {
      eventsPerSecond: 10,
    },
  },
  global: {
    headers: {
      'x-application-name': 'radiox-frontend',
      'x-client-version': '1.0.0',
    },
  },
  db: {
    // 🔥 OPTIMIZATION: Database connection optimizations
    schema: 'public',
  },
  // Network performance configured via global headers
})

// 🔥 OPTIMIZATION: Query helper functions following backend team specs
export const optimizedQueries = {
  // Backend team spec: Alle Show-Daten - direkter Supabase Zugriff
  getAllShows: () => supabase
    .from('shows')
    .select('*')
    .order('created_at', { ascending: false }),

  // Backend team spec: Show-Vorlagen für Dropdown/Selection  
  getActivePresets: () => supabase
    .from('show_presets')
    .select('*')
    .eq('is_active', true),

  // Backend team spec: Speaker-Auswahl für Show-Generation
  getActiveSpeakers: () => supabase
    .from('voice_configurations')
    .select('speaker_name, voice_name, language')
    .eq('is_active', true),
    
  // Show list with full object for TypeScript compatibility
  getShowList: (limit = 20) => supabase
    .from('shows')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit),
}

// 🔥 PERFORMANCE: Query performance monitoring
export const withPerformanceTracking = async <T>(
  queryName: string,
  queryPromise: Promise<T>
): Promise<T> => {
  const startTime = performance.now()
  
  try {
    const result = await queryPromise
    const duration = performance.now() - startTime
    
    // Log slow queries (>1s) for optimization
    if (duration > 1000) {
      console.warn(`🐌 Slow query: ${queryName} took ${duration.toFixed(2)}ms`)
    } else if (process.env.NODE_ENV === 'development') {
      console.log(`⚡ Query: ${queryName} completed in ${duration.toFixed(2)}ms`)
    }
    
    return result
  } catch (error) {
    const duration = performance.now() - startTime
    console.error(`❌ Query failed: ${queryName} (${duration.toFixed(2)}ms)`, error)
    throw error
  }
}

// Export types for easier use throughout the app
export type { Database, Tables, TablesInsert, TablesUpdate } from './types' 