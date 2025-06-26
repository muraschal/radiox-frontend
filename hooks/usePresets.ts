import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { ShowPreset, VoiceConfiguration } from '../lib/types'

interface UsePresetsReturn {
  presets: ShowPreset[]
  voices: VoiceConfiguration[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  clearError: () => void
}

export function usePresets(): UsePresetsReturn {
  const [presets, setPresets] = useState<ShowPreset[]>([])
  const [voices, setVoices] = useState<VoiceConfiguration[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch show presets and voice configurations in parallel
      const [presetsResult, voicesResult] = await Promise.all([
        supabase
          .from('show_presets')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false }),
        supabase
          .from('voice_configurations')
          .select('*')
          .eq('is_active', true)
          .order('speaker_name', { ascending: true })
      ])

      if (presetsResult.error) throw presetsResult.error
      if (voicesResult.error) throw voicesResult.error

      setPresets(presetsResult.data || [])
      setVoices(voicesResult.data || [])
    } catch (err: any) {
      console.error('Error fetching presets/voices:', err)
      setError(err.message || 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }, [])

  // Load data on mount
  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    presets,
    voices,
    loading,
    error,
    refetch: fetchData,
    clearError,
  }
} 