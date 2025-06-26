// 🎯 RADIOX FRONTEND TYPES - SUPABASE DIRECT ACCESS (UPDATED)
// Clean Architecture - Google Engineering Principles

// ================================================================================
// SUPABASE DATABASE TYPES (Auto-generated - Updated Schema)
// ================================================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      configuration: {
        Row: {
          config_key: string
          config_value: string | null
          created_at: string | null
          description: string | null
          id: number
          is_sensitive: boolean | null
          updated_at: string | null
        }
        Insert: {
          config_key: string
          config_value?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          is_sensitive?: boolean | null
          updated_at?: string | null
        }
        Update: {
          config_key?: string
          config_value?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          is_sensitive?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      elevenlabs_models: {
        Row: {
          concurrency_group: string | null
          cost_multiplier: number | null
          created_at: string | null
          description: string | null
          id: number
          is_active: boolean | null
          languages: Json | null
          latency_ms: number | null
          max_characters_free: number | null
          max_characters_paid: number | null
          model_id: string
          model_name: string
          quality_tier: string | null
          requires_alpha_access: boolean | null
          supports_speaker_boost: boolean | null
          supports_style_control: boolean | null
          supports_text_to_speech: boolean | null
          supports_voice_conversion: boolean | null
          updated_at: string | null
        }
        Insert: {
          concurrency_group?: string | null
          cost_multiplier?: number | null
          created_at?: string | null
          description?: string | null
          id?: number
          is_active?: boolean | null
          languages?: Json | null
          latency_ms?: number | null
          max_characters_free?: number | null
          max_characters_paid?: number | null
          model_id: string
          model_name: string
          quality_tier?: string | null
          requires_alpha_access?: boolean | null
          supports_speaker_boost?: boolean | null
          supports_style_control?: boolean | null
          supports_text_to_speech?: boolean | null
          supports_voice_conversion?: boolean | null
          updated_at?: string | null
        }
        Update: {
          concurrency_group?: string | null
          cost_multiplier?: number | null
          created_at?: string | null
          description?: string | null
          id?: number
          is_active?: boolean | null
          languages?: Json | null
          latency_ms?: number | null
          max_characters_free?: number | null
          max_characters_paid?: number | null
          model_id?: string
          model_name?: string
          quality_tier?: string | null
          requires_alpha_access?: boolean | null
          supports_speaker_boost?: boolean | null
          supports_style_control?: boolean | null
          supports_text_to_speech?: boolean | null
          supports_voice_conversion?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      rss_feed_preferences: {
        Row: {
          created_at: string | null
          description: string | null
          feed_category: string
          feed_url: string
          id: string
          is_active: boolean | null
          priority: number | null
          source_name: string
          updated_at: string | null
          weight: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          feed_category: string
          feed_url: string
          id?: string
          is_active?: boolean | null
          priority?: number | null
          source_name: string
          updated_at?: string | null
          weight?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          feed_category?: string
          feed_url?: string
          id?: string
          is_active?: boolean | null
          priority?: number | null
          source_name?: string
          updated_at?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      shows: {
        Row: {
          audio_duration_seconds: number | null
          audio_file_size: number | null
          audio_url: string | null
          broadcast_style: string
          channel: string
          created_at: string | null
          estimated_duration_minutes: number
          id: string
          language: string
          metadata: Json | null
          news_count: number | null
          preset_name: string | null
          script_content: string
          script_preview: string | null
          session_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          audio_duration_seconds?: number | null
          audio_file_size?: number | null
          audio_url?: string | null
          broadcast_style: string
          channel: string
          created_at?: string | null
          estimated_duration_minutes: number
          id?: string
          language: string
          metadata?: Json | null
          news_count?: number | null
          preset_name?: string | null
          script_content: string
          script_preview?: string | null
          session_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          audio_duration_seconds?: number | null
          audio_file_size?: number | null
          audio_url?: string | null
          broadcast_style?: string
          channel?: string
          created_at?: string | null
          estimated_duration_minutes?: number
          id?: string
          language?: string
          metadata?: Json | null
          news_count?: number | null
          preset_name?: string | null
          script_content?: string
          script_preview?: string | null
          session_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      show_presets: {
        Row: {
          city_focus: string | null
          created_at: string | null
          description: string | null
          display_name: string
          gpt_selection_instructions: string | null
          id: string
          is_active: boolean | null
          preset_name: string
          primary_speaker: string
          rss_feed_filter: string | null
          secondary_speaker: string | null
          updated_at: string | null
          weather_speaker: string | null
        }
        Insert: {
          city_focus?: string | null
          created_at?: string | null
          description?: string | null
          display_name: string
          gpt_selection_instructions?: string | null
          id?: string
          is_active?: boolean | null
          preset_name: string
          primary_speaker: string
          rss_feed_filter?: string | null
          secondary_speaker?: string | null
          updated_at?: string | null
          weather_speaker?: string | null
        }
        Update: {
          city_focus?: string | null
          created_at?: string | null
          description?: string | null
          display_name?: string
          gpt_selection_instructions?: string | null
          id?: string
          is_active?: boolean | null
          preset_name?: string
          primary_speaker?: string
          rss_feed_filter?: string | null
          secondary_speaker?: string | null
          updated_at?: string | null
          weather_speaker?: string | null
        }
        Relationships: []
      }
      voice_configurations: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          is_active: boolean
          is_primary: boolean
          language: string
          model: string
          similarity_boost: number
          speaker_name: string
          stability: number
          style: number
          updated_at: string | null
          use_speaker_boost: boolean
          voice_id: string
          voice_name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          is_active?: boolean
          is_primary?: boolean
          language: string
          model?: string
          similarity_boost?: number
          speaker_name: string
          stability?: number
          style?: number
          updated_at?: string | null
          use_speaker_boost?: boolean
          voice_id: string
          voice_name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          is_active?: boolean
          is_primary?: boolean
          language?: string
          model?: string
          similarity_boost?: number
          speaker_name?: string
          stability?: number
          style?: number
          updated_at?: string | null
          use_speaker_boost?: boolean
          voice_id?: string
          voice_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// ================================================================================
// SUPABASE TYPE HELPERS
// ================================================================================

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

// ================================================================================
// APPLICATION TYPES (Based on Updated Supabase Schema)
// ================================================================================

// Core Database Types
export type Show = Tables<'shows'>
export type ShowInsert = TablesInsert<'shows'>
export type ShowUpdate = TablesUpdate<'shows'>
export type ShowPreset = Tables<'show_presets'>
export type VoiceConfiguration = Tables<'voice_configurations'>
export type ElevenLabsModel = Tables<'elevenlabs_models'>
export type Configuration = Tables<'configuration'>
export type RSSFeedPreference = Tables<'rss_feed_preferences'>

// Extended Types for Frontend
export interface FormattedShow extends Show {
  formattedDate: string
  formattedDuration: string
  hasAudio: boolean
  audioFileSize?: string
}

// ================================================================================
// UI STATE TYPES
// ================================================================================

export interface ShowsState {
  shows: Show[]
  selectedShow: Show | null
  currentlyPlaying: Show | null
  loading: boolean
  error: string | null
}

export interface AudioPlayerState {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  loading: boolean
  error: string | null
}

// ================================================================================
// SEARCH & FILTER TYPES
// ================================================================================

export interface ShowFilters {
  channel?: string
  broadcast_style?: string
  language?: string
  preset_name?: string
  dateFrom?: string
  dateTo?: string
  hasAudio?: boolean
}

export interface ShowSearchParams extends ShowFilters {
  query?: string
  limit?: number
  offset?: number
  sortBy?: 'created_at' | 'title' | 'estimated_duration_minutes'
  sortOrder?: 'asc' | 'desc'
}

// ================================================================================
// ERROR HANDLING TYPES
// ================================================================================

export interface ShowError {
  code: string
  message: string
  details?: any
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  error?: string
  timestamp: string
}

// ================================================================================
// CONSTANT TYPES (Updated with new DB constraints)
// ================================================================================

export const CHANNELS = ['zurich', 'basel', 'bern', 'global'] as const
export const LANGUAGES = ['de', 'en'] as const
export const BROADCAST_STYLES = [
  'Professional Afternoon',
  'Chill Evening', 
  'Morning Briefing',
  'Weekend Special'
] as const

export type Channel = typeof CHANNELS[number]
export type Language = typeof LANGUAGES[number]
export type BroadcastStyle = typeof BROADCAST_STYLES[number]

// ================================================================================
// UTILITY TYPES
// ================================================================================

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'
export type Environment = 'development' | 'staging' | 'production' 