import { useState, useEffect, useCallback } from 'react';

// TypeScript Interfaces
export interface Show {
  id: string;
  title: string;
  created_at: string;
  channel: string;
  language: string;
  news_count: number;
  broadcast_style: string;
  script_preview: string;
}

export interface ShowDetails {
  session_id: string;
  script_content: string;
  broadcast_style: string;
  estimated_duration_minutes: number;
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

export interface ShowsListResponse {
  shows: Show[];
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
}

export interface GenerateShowRequest {
  channel?: string;
  news_count?: number;
  language?: string;
  target_time?: string;
  primary_speaker?: string;
  secondary_speaker?: string;
}

const API_BASE_URL = 'https://api.radiox.cloud';

export const useRadioXAPI = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [currentShow, setCurrentShow] = useState<ShowDetails | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch shows list
  const fetchShows = useCallback(async (limit = 10, offset = 0): Promise<ShowsListResponse> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/shows?limit=${limit}&offset=${offset}`, {
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch shows: ${response.statusText}`);
      }
      
      const data: ShowsListResponse = await response.json();
      setShows(data.shows);
      setError(null);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch shows';
      setError(errorMessage);
      console.error('Error fetching shows:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Generate new show
  const generateShow = useCallback(async (request: GenerateShowRequest = {}): Promise<ShowDetails> => {
    setIsGenerating(true);
    setError(null);
    
    // Add optimistic placeholder
    const placeholderShow: Show = {
      id: 'generating',
      title: 'Generating Show...',
      created_at: new Date().toISOString(),
      channel: request.channel || 'zurich',
      language: request.language || 'de',
      news_count: request.news_count || 2,
      broadcast_style: 'Generating',
      script_preview: 'KI generiert gerade eine neue Show...'
    };
    setShows(prev => [placeholderShow, ...prev]);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/shows/generate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(request),
      });
      
      if (!response.ok) {
        throw new Error(`Generation failed: ${response.statusText}`);
      }
      
      const newShow: ShowDetails = await response.json();
      setCurrentShow(newShow);
      
      // Replace placeholder with real show
      const realShow: Show = {
        id: newShow.session_id,
        title: `${newShow.broadcast_style} - ${newShow.metadata.channel}`,
        created_at: newShow.metadata.generated_at,
        channel: newShow.metadata.channel,
        language: newShow.metadata.language,
        news_count: newShow.metadata.content_stats.news_selected,
        broadcast_style: newShow.broadcast_style,
        script_preview: newShow.script_content.substring(0, 200) + '...'
      };
      
      setShows(prev => prev.map(show => 
        show.id === 'generating' ? realShow : show
      ));
      
      setError(null);
      return newShow;
    } catch (err) {
      // Remove placeholder on error
      setShows(prev => prev.filter(show => show.id !== 'generating'));
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate show';
      setError(errorMessage);
      console.error('Error generating show:', err);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // Load show details
  const loadShow = useCallback(async (showId: string): Promise<ShowDetails> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/shows/${showId}`, {
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to load show: ${response.statusText}`);
      }
      
      const show: ShowDetails = await response.json();
      setCurrentShow(show);
      setError(null);
      return show;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load show';
      setError(errorMessage);
      console.error('Error loading show:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-fetch shows on mount
  useEffect(() => {
    fetchShows();
  }, [fetchShows]);

  // Format time helper
  const formatDuration = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Get available channels
  const getChannels = useCallback(() => {
    return [
      { id: 'zurich', name: 'Zürich Local', description: 'Local news from Zurich and surrounding areas' },
      { id: 'basel', name: 'Basel', description: 'Basel regional news and updates' },
      { id: 'bern', name: 'Bern', description: 'Bern capital region news' },
    ];
  }, []);

  // Get available speakers
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