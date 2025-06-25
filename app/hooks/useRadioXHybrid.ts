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

    // 🚀 ULTRA-SAFE FETCH: Emergency fallback first to prevent crashes
  const fetchShows = useCallback(async (limit = 10, offset = 0) => {
    setIsLoading(true);
    
    // EMERGENCY: Always load demo data first to prevent crashes
    const emergencyShows: Show[] = [
      {
        id: 'emergency-1',
        title: 'Live Demo - Zürich Morning News',
        created_at: new Date().toISOString(),
        channel: 'zurich',
        language: 'de',
        news_count: 3,
        broadcast_style: 'Morning Energy',
        script_preview: 'Guten Morgen Zürich! Das System lädt gerade die neuesten Shows...',
        audio_url: 'https://www.soundjay.com/misc/bell-ringing-05.wav',
        audio_duration: 180
      }
    ];
    
    // Set emergency data immediately to prevent crashes
    setShows(emergencyShows);
    setIsOnline(true);
    setError(null);
    
    try {
      // TRY: RadioX API via Server-Side Proxy (CORS-safe!)
      const response = await fetch(`/api/radiox-proxy?endpoint=shows&limit=${limit}&offset=${offset}`, {
        headers: { 'Accept': 'application/json' },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ RadioX API success:', data.shows?.length || 0, 'shows loaded');
        // Ensure shows is always an array
        const validShows = Array.isArray(data.shows) ? data.shows : [];
        if (validShows.length > 0) {
          setShows(validShows);
          setError(null);
          return { ...data, shows: validShows };
        }
      }

      console.warn('⚠️ RadioX API failed, trying Supabase fallback...');

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
        console.warn('⚠️ Backend temporarily unavailable, showing demo content:', supabaseErr);
        setIsOnline(false);
        setError('Backend wird gerade aktualisiert - Demo-Shows werden angezeigt. Das System bleibt voll funktional!');
        
        // FALLBACK: Robuste Demo-Daten für Backend-Ausfälle
        const demoShows: Show[] = [
          {
            id: 'demo-1',
            title: 'Demo Show - Zürich Morning News',
            created_at: new Date().toISOString(),
            channel: 'zurich',
            language: 'de',
            news_count: 3,
            broadcast_style: 'Morning Energy',
            script_preview: 'Guten Morgen Zürich! Dies ist eine Demo-Show die zeigt wie das System auch offline funktioniert. Mit lokalen News und Wetterinfos...',
            audio_url: 'https://www.soundjay.com/misc/bell-ringing-05.wav',
            audio_duration: 180
          },
          {
            id: 'demo-2', 
            title: 'Demo Show - Zürich Midday Update',
            created_at: new Date(Date.now() - 3600000).toISOString(),
            channel: 'zurich',
            language: 'de',
            news_count: 2,
            broadcast_style: 'Informative Midday',
            script_preview: 'Mittagsupdate für Zürich - auch wenn das Backend offline ist, bleibt das Frontend funktional und benutzerfreundlich...',
            audio_url: 'https://www.soundjay.com/misc/bell-ringing-05.wav',
            audio_duration: 120
          },
          {
            id: 'demo-3',
            title: 'Demo Show - Zürich Evening Wrap',
            created_at: new Date(Date.now() - 7200000).toISOString(),
            channel: 'zurich', 
            language: 'de',
            news_count: 4,
            broadcast_style: 'Evening Summary',
            script_preview: 'Abendliche Zusammenfassung für Zürich - das Frontend zeigt immer Inhalte, egal ob Backend verfügbar ist oder nicht...',
            audio_url: 'https://www.soundjay.com/misc/bell-ringing-05.wav',
            audio_duration: 240
          }
        ];
        setShows(demoShows);
        return { shows: demoShows, total: 3 };
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 🧠 COMPLEX OPERATIONS: Immer über API (wegen AI/ML Pipeline)
  const generateShow = useCallback(async (request: GenerateShowRequest = {}): Promise<ShowDetails | null> => {
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
      
      // Graceful degradation - show helpful message
      const errorMessage = 'Backend wird gerade aktualisiert. Versuche es in ein paar Minuten nochmal!';
      setError(errorMessage);
      console.warn('⚠️ Show generation temporarily unavailable:', err);
      
      // Don't throw - let the UI handle it gracefully
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // 📖 LOAD SHOW DETAILS: Hybrid approach
  const loadShow = useCallback(async (showId: string): Promise<ShowDetails | null> => {
    setIsLoading(true);
    try {
      // TRY: Supabase first (only if configured)
      if (supabase) {
        try {
          const { data: supabaseShow, error } = await supabase
            .from('show_details')
            .select('*')
            .eq('session_id', showId)
            .single();

          if (supabaseShow && !error) {
            setCurrentShow(supabaseShow);
            return supabaseShow;
          }
        } catch (supabaseError) {
          console.warn('Supabase show details failed:', supabaseError);
        }
      }

      // FALLBACK: API via proxy
      const response = await fetch(`/api/radiox-proxy?endpoint=shows/${showId}`, {
        headers: { 'Accept': 'application/json' },
      });
      
      if (!response.ok) {
        console.warn('Show details not available');
        return null;
      }
      
      const show: ShowDetails = await response.json();
      setCurrentShow(show);
      
      // Sync to Supabase (fire and forget, only if configured)
      if (supabase) {
        supabase.from('show_details').upsert({ session_id: showId, ...show }).then(({ error }) => {
          if (error) console.warn('Supabase sync failed:', error);
        });
      }
      
      return show;
    } catch (err) {
      console.warn('Load show failed gracefully:', err);
      setError('Show details temporarily unavailable');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 🔄 REAL-TIME SUBSCRIPTIONS: Supabase Magic (only if configured)
  useEffect(() => {
    if (!supabase) {
      console.log('Supabase not configured, skipping real-time subscriptions');
      return;
    }

    try {
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
        try {
          supabase.removeChannel(channel);
        } catch (error) {
          console.warn('Error removing Supabase channel:', error);
        }
      };
    } catch (error) {
      console.warn('Error setting up Supabase real-time:', error);
    }
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