/**
 * @fileoverview AudioPlayer Component - Complete audio playback solution for RadioX
 * 
 * Features:
 * - Full playback controls (play/pause, seek, volume)
 * - Progress bar with seek functionality
 * - Time display (current/duration)
 * - Volume control with mute toggle
 * - Loading states and error handling
 * - Responsive design for all devices
 * 
 * Architecture:
 * - Clean state management with useCallback optimization
 * - Separation of concerns (audio logic vs UI)
 * - Google Engineering principles applied
 * 
 * @author RadioX Team
 * @version 2.0.0
 */

'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';
import type { Show, AudioPlayerState } from '../../lib/types';

/**
 * Props interface for AudioPlayer component
 */
interface AudioPlayerProps {
  /** Current show being played */
  show: Show | null;
  /** Called when playback starts */
  onPlay?: (show: Show) => void;
  /** Called when playback stops */
  onPause?: () => void;
  /** Called when show changes */
  onShowChange?: (show: Show | null) => void;
  /** Additional CSS classes */
  className?: string;
}

export function AudioPlayer({ show, onPlay, onPause, onShowChange, className = '' }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [state, setState] = useState({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.8,
    isMuted: false,
    loading: false,
    error: null,
  });

  const audioUrl = show?.audio_url;

  // Optimized state updater to prevent unnecessary re-renders
  const updateState = useCallback((updates: Partial<typeof state>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Toggle play/pause with error handling
  const togglePlayPause = useCallback(async () => {
    if (!audioRef.current || !audioUrl) return;

    try {
      if (state.isPlaying) {
        audioRef.current.pause();
        onPause?.();
      } else {
        updateState({ loading: true, error: null });
        await audioRef.current.play();
        onPlay?.(show);
      }
    } catch (error) {
      console.error('Audio playback error:', error);
      updateState({ 
        error: 'Wiedergabe fehlgeschlagen', 
        loading: false, 
        isPlaying: false 
      });
    }
  }, [state.isPlaying, show, onPlay, onPause, updateState]);

  // Handle volume changes with mute state management
  const handleVolumeChange = useCallback((newVolume: number) => {
    if (!audioRef.current) return;
    
    const volume = Math.max(0, Math.min(1, newVolume));
    audioRef.current.volume = volume;
    updateState({ 
      volume, 
      isMuted: volume === 0 
    });
  }, [updateState]);

  // Toggle mute state
  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;
    
    if (state.isMuted) {
      audioRef.current.volume = state.volume;
      updateState({ isMuted: false });
    } else {
      audioRef.current.volume = 0;
      updateState({ isMuted: true });
    }
  }, [state.isMuted, state.volume, updateState]);

  // Seeks to specific time position
  const handleSeek = useCallback((timePercent: number) => {
    if (!audioRef.current || !state.duration) return;
    
    const newTime = (timePercent / 100) * state.duration;
    audioRef.current.currentTime = newTime;
    updateState({ currentTime: newTime });
  }, [state.duration, updateState]);

  // Format time helper
  const formatTime = useCallback((seconds: number): string => {
    if (!isFinite(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Audio event listeners for state synchronization
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      updateState({ 
        duration: audio.duration,
        loading: false,
        error: null 
      });
    };

    const handleTimeUpdate = () => {
      updateState({ currentTime: audio.currentTime });
    };

    const handlePlay = () => {
      updateState({ isPlaying: true, loading: false });
    };

    const handlePause = () => {
      updateState({ isPlaying: false });
    };

    const handleEnded = () => {
      updateState({ isPlaying: false, currentTime: 0 });
      onShowChange?.(null);
    };

    const handleError = () => {
      updateState({ 
        error: 'Audio konnte nicht geladen werden',
        loading: false,
        isPlaying: false 
      });
    };

    // Attach event listeners
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Cleanup on unmount
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [updateState, onShowChange]);

  // Handle show changes
  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl;
      updateState({ 
        currentTime: 0, 
        isPlaying: false, 
        error: null 
      });
    }
  }, [audioUrl, updateState]);

  // No audio available
  if (!audioUrl) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-gray-400 mb-2">Kein Audio verfügbar</div>
        <div className="text-sm text-gray-500">
          Show ist noch in Bearbeitung oder Audio wird generiert
        </div>
      </div>
    );
  }

  const progressPercent = state.duration ? (state.currentTime / state.duration) * 100 : 0;

  return (
    <div className={`bg-black/30 rounded-2xl p-6 border border-white/10 ${className}`}>
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        preload="metadata"
      >
        <source src={audioUrl} type="audio/mpeg" />
        Ihr Browser unterstützt das Audio-Element nicht.
      </audio>

      {/* Show Info */}
      <div className="mb-4">
        <h4 className="text-white font-medium text-sm truncate">
          {show?.title}
        </h4>
        <p className="text-gray-300 text-xs">
          {show?.channel} • {show?.broadcast_style}
        </p>
        <p className="text-gray-400 text-sm">
          {show?.estimated_duration_minutes || 'N/A'} Min • {show?.news_count || 0} News
        </p>
      </div>

      {/* Error Display */}
      {state.error && (
        <div className="mb-3 p-2 bg-red-500/20 border border-red-500/30 rounded text-red-300 text-xs">
          {state.error}
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-3">
        <div 
          className="w-full h-2 bg-white/20 rounded-full cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = ((e.clientX - rect.left) / rect.width) * 100;
            handleSeek(percent);
          }}
        >
          <div 
            className="h-full bg-gradient-to-r from-blue-400 to-green-400 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        
        {/* Time Display */}
        <div className="flex justify-between text-xs text-gray-300 mt-1">
          <span>{formatTime(state.currentTime)}</span>
          <span>{formatTime(state.duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <button 
            className="p-2 text-gray-400 hover:text-white transition-colors"
            disabled
          >
            <SkipBack className="w-4 h-4" />
          </button>
          
          <button
            onClick={togglePlayPause}
            disabled={state.loading}
            className="p-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-full hover:scale-105 transition-all disabled:opacity-50"
          >
            {state.loading ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : state.isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4 ml-0.5" />
            )}
          </button>
          
          <button 
            className="p-2 text-gray-400 hover:text-white transition-colors"
            disabled
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            {state.isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          
          <input
            type="range"
            min="0"
            max="100"
            value={state.isMuted ? 0 : state.volume * 100}
            onChange={(e) => handleVolumeChange(Number(e.target.value) / 100)}
            className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>
    </div>
  );
} 