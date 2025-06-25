import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

// TypeScript Interfaces (übernommen aus useRadioXAPI.ts)
export interface Show {
  id: string;
  title: string;
  created_at: string;
  channel: string;
  language: string;
  news_count: number;
  broadcast_style: string;
  script_preview: string;
  audio_url?: string;
  audio_duration?: number;
}

export interface ShowDetails {
  session_id: string;
  script_content: string;
  broadcast_style: string;
  estimated_duration_minutes: number;
  audio_url?: string;
  audio_duration?: number;
  segments: Array<{
    type: string;
    speaker: string;
    text: string;
    estimated_duration: number;
  }>;
  metadata: {
    channel: string;
    language: string;
    audio_url: string;
    audio_duration: number;
    generated_at: string;
    speakers: {
      primary: {
        id: string;
        name: string;
        voice_id: string;
      };
      secondary?: {
        name: string;
      };
    };
    content_stats: {
      total_news_collected: number;
      news_selected: number;
    };
  };
}

export interface GenerateShowRequest {
  channel?: string;
  news_count?: number;
  language?: string;
  target_time?: string;
  primary_speaker?: string;
  secondary_speaker?: string;
}

// Supabase Client - Environment Variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zwcvvbgkqhexfcldwuxq.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

// RadioX API Direct - Environment Variable
const RADIOX_API_BASE = process.env.NEXT_PUBLIC_RADIOX_API_BASE || 'https://api.radiox.cloud';

export const useRadioXHybrid = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [currentShow, setCurrentShow] = useState<ShowDetails | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  // 🚀 HYBRID FETCH: RadioX API First (reliable), Supabase Fallback
  const fetchShows = useCallback(async (limit = 10, offset = 0) => {
    setIsLoading(true);
    try {
      // TRY: RadioX API via Server-Side Proxy (CORS-safe!)
      const response = await fetch(`/api/radiox-proxy?endpoint=shows&limit=${limit}&offset=${offset}`, {
        headers: { 'Accept': 'application/json' },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ RadioX API success:', data.shows?.length || 0, 'shows loaded');
        setShows(data.shows || []);
        setIsOnline(true);
        setError(null);
        return data;
      }

      console.warn('⚠️ RadioX API failed, trying Supabase fallback...');
      throw new Error('RadioX API failed, trying Supabase...');

    } catch (apiErr) {
      console.warn('🔄 RadioX API failed, falling back to Supabase:', apiErr);
      
      // FALLBACK: Supabase (nur wenn API offline und Key vorhanden)
      try {
        if (!supabase) {
          throw new Error('Supabase not configured - missing API key');
        }

        const { data: supabaseShows, error: supabaseError } = await supabase
          .from('shows')
          .select('*')
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);

        if (supabaseShows && !supabaseError && supabaseShows.length > 0) {
          console.log('✅ Supabase fallback success:', supabaseShows.length, 'shows loaded');
          setShows(supabaseShows);
          setIsOnline(true);
          setError('RadioX API offline - Supabase Daten werden verwendet');
          return { shows: supabaseShows, total: supabaseShows.length };
        }

        throw new Error('Supabase also failed or empty');
      } catch (supabaseErr) {
        console.error('❌ Both RadioX API and Supabase failed:', supabaseErr);
        setIsOnline(false);
        setError('Alle Datenquellen offline. Demo-Daten werden angezeigt.');
        
        // FALLBACK: Demo-Daten für Entwicklung
        const demoShows: Show[] = [
          {
            id: 'demo-1',
            title: 'Demo Show - Zürich Morning',
            created_at: new Date().toISOString(),
            channel: 'zurich',
            language: 'de',
            news_count: 3,
            broadcast_style: 'Morning Energy',
            script_preview: 'Dies ist eine Demo-Show für Entwicklungszwecke...',
            audio_url: 'https://www.soundjay.com/misc/bell-ringing-05.wav'
          }
        ];
        setShows(demoShows);
        return { shows: demoShows, total: 1 };
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 🧠 COMPLEX OPERATIONS: Immer über API (wegen AI/ML Pipeline)
  const generateShow = useCallback(async (request: GenerateShowRequest = {}): Promise<ShowDetails> => {
    setIsGenerating(true);
    setError(null);
    
    // Optimistic Update
    const placeholderShow: Show = {
      id: 'generating',
      title: 'KI generiert Show...',
      created_at: new Date().toISOString(),
      channel: request.channel || 'zurich',
      language: request.language || 'de',
      news_count: request.news_count || 2,
      broadcast_style: 'Generating',
      script_preview: 'KI arbeitet an deiner personalisierten Radio Show...'
    };
    setShows(prev => [placeholderShow, ...prev]);
    
         try {
       // RadioX API via Server-Side Proxy (CORS-safe!)
       const response = await fetch(`/api/radiox-proxy`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(request),
       });
       
       if (!response.ok) {
         throw new Error(`RadioX API Error: ${response.status} - ${response.statusText}`);
       }
       
       const newShow = await response.json();
       setCurrentShow(newShow);
       
       // Update optimistic state mit direkter Audio-URL
       const realShow: Show = {
         id: newShow.session_id,
         title: `${newShow.broadcast_style} - ${newShow.metadata.channel}`,
         created_at: newShow.metadata.generated_at,
         channel: newShow.metadata.channel,
         language: newShow.metadata.language,
         news_count: newShow.metadata.content_stats.news_selected,
         broadcast_style: newShow.broadcast_style,
         script_preview: newShow.script_content.substring(0, 200) + '...',
         audio_url: newShow.metadata.audio_url, // Direkte URL von API
         audio_duration: newShow.metadata.audio_duration
       };
       
       // Sync to Supabase (fire and forget, only if configured)
       if (supabase) {
         supabase.from('shows').upsert(realShow).then(({ error }) => {
           if (error) console.warn('Supabase sync failed:', error);
         });
       }
       
       setShows(prev => prev.map(show => 
         show.id === 'generating' ? realShow : show
       ));
       
       return newShow;
      
    } catch (err) {
      // Remove optimistic update
      setShows(prev => prev.filter(show => show.id !== 'generating'));
      const errorMessage = err instanceof Error ? err.message : 'Show generation failed';
      setError(errorMessage);
      console.error('Error generating show:', err);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // 📖 LOAD SHOW DETAILS: Hybrid approach
  const loadShow = useCallback(async (showId: string): Promise<ShowDetails> => {
    setIsLoading(true);
    try {
      // TRY: Supabase first
      const { data: supabaseShow, error } = await supabase
        .from('show_details')
        .select('*')
        .eq('session_id', showId)
        .single();

      if (supabaseShow && !error) {
        setCurrentShow(supabaseShow);
        return supabaseShow;
      }

      // FALLBACK: API
      const response = await fetch(`${RADIOX_API_BASE}/api/v1/shows/${showId}`, {
        headers: { 'Accept': 'application/json' },
      });
      
      if (!response.ok) throw new Error(`Failed to load show: ${response.statusText}`);
      
      const show: ShowDetails = await response.json();
      setCurrentShow(show);
      
      // Sync to Supabase (fire and forget)
      supabase.from('show_details').upsert({ session_id: showId, ...show });
      
      return show;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load show';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 🔄 REAL-TIME SUBSCRIPTIONS: Supabase Magic
  useEffect(() => {
    const channel = supabase
      .channel('shows-realtime')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'shows' 
      }, (payload) => {
        console.log('New show added:', payload.new);
        setShows(prev => [payload.new as Show, ...prev]);
      })
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'shows' 
      }, (payload) => {
        console.log('Show updated:', payload.new);
        setShows(prev => prev.map(show => 
          show.id === payload.new.id ? payload.new as Show : show
        ));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    fetchShows();
  }, [fetchShows]);

  // Helper functions
  const formatDuration = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const getChannels = useCallback(() => {
    return [
      { id: 'zurich', name: 'Zürich Local', description: 'Local news from Zurich and surrounding areas' },
      { id: 'basel', name: 'Basel', description: 'Basel regional news and updates' },
      { id: 'bern', name: 'Bern', description: 'Bern capital region news' },
    ];
  }, []);

  const getSpeakers = useCallback(() => {
    return [
      { id: 'marcel', name: 'Marcel', description: 'Primary host with tech expertise' },
      { id: 'jarvis', name: 'Jarvis', description: 'AI co-host with analytical insights' },
      { id: 'lucy', name: 'Lucy', description: 'Weather and lifestyle specialist' },
      { id: 'brad', name: 'Brad', description: 'International news correspondent' },
    ];
  }, []);

  return {
    // State
    shows,
    currentShow,
    isGenerating,
    isLoading,
    error,
    isOnline,
    
    // Actions
    fetchShows,
    generateShow,
    loadShow,
    clearError: () => setError(null),
    
    // Helpers
    formatDuration,
    getChannels,
    getSpeakers,
  };
}; 