// 🎨 RADIOX FRONTEND - RESTORED BEAUTIFUL DESIGN + OPTIMIZED FUNCTIONALITY

'use client'

import React, { useState, useEffect } from 'react'
import { Play, Pause, Volume2, Download, Radio, Zap, Clock, Mic, Settings, Database, Brain, Headphones, Users, MapPin } from 'lucide-react'
import { AudioPlayer } from '../components/audio/AudioPlayer'
import { ShowGenerator } from '../components/shows/ShowGenerator'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { ErrorMessage } from '../components/ui/ErrorMessage'
import { useShows } from '../hooks/useShows'
import { usePresets } from '../hooks/usePresets'
import type { Show } from '../lib/types'

export default function HomePage() {
  const { 
    shows, 
    selectedShow, 
    currentlyPlaying, 
    loading, 
    error, 
    selectShow, 
    setCurrentlyPlaying, 
    clearError, 
    formatShow 
  } = useShows()

  const { 
    presets, 
    voices, 
    loading: presetsLoading 
  } = usePresets()

  const [showDetails, setShowDetails] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState(presets[0] || null)
  const [currentTime, setCurrentTime] = useState<string>('')

  // Client-side time to prevent hydration mismatch
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('de-CH'))
    }
    
    // Set initial time
    updateTime()
    
    // Update every second
    const interval = setInterval(updateTime, 1000)
    
    return () => clearInterval(interval)
  }, [])

  // Update selectedPreset when presets load
  useEffect(() => {
    if (presets.length > 0 && !selectedPreset) {
      setSelectedPreset(presets[0])
    }
  }, [presets, selectedPreset])

  const handleShowGeneration = async () => {
    // Refresh shows after generation
    window.location.reload() // Simple refresh for now
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Smart currentShow selection - prefer shows with audio
  const getDefaultShow = () => {
    if (currentlyPlaying) return currentlyPlaying
    if (selectedShow) return selectedShow
    
    // Find first show with audio_url
    const showWithAudio = shows.find(show => show.audio_url)
    if (showWithAudio) return showWithAudio
    
    // Fallback to first show (even without audio)
    return shows[0] || null
  }

  const currentShow = getDefaultShow()
  const formattedCurrentShow = currentShow ? formatShow(currentShow) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950">
      {/* MVP Banner */}
      <div className="fixed top-0 right-0 bg-red-500 text-white font-bold text-xs uppercase tracking-wider transform rotate-45 origin-center z-50 w-32 h-8 flex items-center justify-center mt-4 -mr-8">
        MVP v5.0
      </div>

      {/* Header with Player Focus */}
      <header className="sticky top-0 z-40 bg-black/40 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Radio<span className="text-red-500">X</span><sup className="text-sm">AI</sup>
              </h1>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-red-400 text-sm font-medium">LIVE</span>
              </div>
            </div>
            <div className="text-gray-400 text-sm font-mono">
              {currentTime}
            </div>
          </div>

          {/* Main Player */}
          <div className="bg-black/30 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-6 mb-4">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Headphones className="w-10 h-10 text-white" />
                </div>
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-1">
                  {currentShow?.title || `${selectedPreset?.display_name || 'Aktuelle Show'}`}
                </h2>
                <p className="text-gray-300 mb-2">
                  {currentShow?.script_preview || selectedPreset?.description || 'AI-generierte Radio Show'}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1 text-blue-400">
                    <MapPin className="w-3 h-3" />
                    {currentShow?.channel || selectedPreset?.city_focus || 'Global'}
                  </span>
                  <span className="flex items-center gap-1 text-purple-400">
                    <Users className="w-3 h-3" />
                    {selectedPreset?.primary_speaker}{selectedPreset?.secondary_speaker && ` & ${selectedPreset.secondary_speaker}`}
                  </span>
                  <span className="flex items-center gap-1 text-green-400">
                    <Clock className="w-3 h-3" />
                    {currentShow?.estimated_duration_minutes || 3} Min
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => currentShow && setCurrentlyPlaying(currentlyPlaying ? null : currentShow)}
                  disabled={!currentShow?.audio_url}
                  className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentlyPlaying ? (
                    <Pause className="w-8 h-8 text-white" />
                  ) : (
                    <Play className="w-8 h-8 text-white ml-1" />
                  )}
                </button>
              </div>
            </div>

            {/* Embedded Audio Player */}
            {currentShow && (
              <AudioPlayer 
                show={currentShow}
                onPlay={(show) => setCurrentlyPlaying(show)}
                onPause={() => setCurrentlyPlaying(null)}
                onShowChange={(show) => setCurrentlyPlaying(show)}
                className="!bg-transparent !border-0 !p-0"
              />
            )}

            {/* Bottom Controls */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-400 font-mono">
                  {formattedCurrentShow?.formattedDate || 'Keine Show'}
                </div>
                {formattedCurrentShow?.hasAudio && (
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                    Audio verfügbar
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowDetails(!showDetails)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Show Details"
                >
                  <Database className="w-4 h-4 text-gray-400" />
                </button>
                {currentShow?.audio_url && (
                  <a
                    href={currentShow.audio_url}
                    download
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4 text-gray-400" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Error Display */}
        {error && (
          <div className="mb-8">
            <ErrorMessage 
              message={error} 
              onDismiss={clearError}
              variant="error"
            />
          </div>
        )}

        {/* Playlist - Available Shows */}
        <div className="bg-black/30 rounded-2xl p-6 border border-white/10 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Radio className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">RadioX Playlist</h3>
                <p className="text-gray-300 text-sm">{shows.length} Shows verfügbar • {shows.filter(s => s.audio_url).length} mit Audio</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-green-400">Mit Audio</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span className="text-orange-400">In Bearbeitung</span>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : shows.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Radio className="w-10 h-10 opacity-50" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Playlist ist leer</h4>
              <p className="mb-4">Noch keine Shows vorhanden</p>
              <p className="text-sm">Generiere deine erste Show mit dem AI Generator unten!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {shows.map((show, index) => {
                const formatted = formatShow(show)
                const isSelected = selectedShow?.id === show.id
                const isPlaying = currentlyPlaying?.id === show.id
                const hasAudio = !!show.audio_url
                
                return (
                  <div
                    key={show.id}
                    onClick={() => selectShow(show)}
                    className={`group relative p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'bg-blue-500/20 border-blue-500/50 shadow-lg shadow-blue-500/20'
                        : 'bg-black/20 border-white/10 hover:bg-white/5 hover:border-white/20'
                    } ${isPlaying ? 'ring-2 ring-green-400/50' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Track Number & Status */}
                      <div className="flex-shrink-0 w-12 h-12 relative">
                        {isPlaying ? (
                          <div className="w-full h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                            <div className="flex gap-1">
                              <div className="w-1 h-3 bg-white rounded-full animate-pulse"></div>
                              <div className="w-1 h-3 bg-white rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                              <div className="w-1 h-3 bg-white rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                            </div>
                          </div>
                        ) : (
                          <div className={`w-full h-full rounded-full flex items-center justify-center text-sm font-semibold ${
                            hasAudio 
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                              : 'bg-gradient-to-r from-gray-600 to-gray-700 text-gray-300'
                          }`}>
                            {String(index + 1).padStart(2, '0')}
                          </div>
                        )}
                        
                        {/* Audio Status Indicator */}
                        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center ${
                          hasAudio ? 'bg-green-400' : 'bg-orange-400'
                        }`}>
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>

                      {/* Track Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-white font-medium truncate">{show.title}</h4>
                          {isPlaying && (
                            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                              Now Playing
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-400 text-sm line-clamp-1 mb-2">
                          {show.script_preview || 'Keine Vorschau verfügbar'}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs">
                          <span className="flex items-center gap-1 text-blue-400">
                            <MapPin className="w-3 h-3" />
                            {show.channel}
                          </span>
                          <span className="text-purple-400">{show.broadcast_style}</span>
                          <span className="text-green-400">{formatted.formattedDate}</span>
                          <span className="text-orange-400">{show.estimated_duration_minutes} Min</span>
                          {show.news_count && (
                            <span className="text-cyan-400">{show.news_count} News</span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <div className="text-right text-xs text-gray-400 mr-2">
                          <div>{formatted.formattedDuration}</div>
                          {formatted.audioFileSize && (
                            <div className="text-green-400">{formatted.audioFileSize}</div>
                          )}
                        </div>
                        
                        {hasAudio ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setCurrentlyPlaying(currentlyPlaying?.id === show.id ? null : show)
                            }}
                            className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full flex items-center justify-center transition-all group-hover:scale-105 shadow-lg"
                          >
                            {isPlaying ? (
                              <Pause className="w-4 h-4 text-white" />
                            ) : (
                              <Play className="w-4 h-4 text-white ml-0.5" />
                            )}
                          </button>
                        ) : (
                          <div className="w-10 h-10 bg-gray-600/50 rounded-full flex items-center justify-center">
                            <Clock className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                        
                        {show.audio_url && (
                          <a
                            href={show.audio_url}
                            download
                            onClick={(e) => e.stopPropagation()}
                            className="w-8 h-8 bg-gray-600/50 hover:bg-gray-600/70 rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                            title="Download"
                          >
                            <Download className="w-3 h-3 text-gray-300" />
                          </a>
                        )}
                      </div>
                    </div>
                    
                    {/* Progress Bar for Currently Playing */}
                    {isPlaying && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span>🎵</span>
                          <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                          </div>
                          <span>Live</span>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Show Generation */}
        <div className="bg-black/30 rounded-2xl p-6 border border-white/10 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <Brain className="w-6 h-6 text-blue-400" />
                AI Show Generator
              </h3>
              <p className="text-gray-300">Erstelle eine personalisierte Radio Show mit aktuellen News und KI-generierten Inhalten</p>
            </div>
          </div>

          {/* Preset Selection */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {presetsLoading ? (
              <div className="col-span-3 flex justify-center py-4">
                <LoadingSpinner size="md" />
              </div>
            ) : (
              presets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setSelectedPreset(preset)}
                  className={`p-4 rounded-xl border transition-all ${
                    selectedPreset?.id === preset.id
                      ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <h4 className="font-semibold mb-1">{preset.display_name}</h4>
                  <p className="text-sm opacity-80">{preset.description}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs">
                    <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                      {preset.city_focus}
                    </span>
                    <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded">
                      {preset.primary_speaker}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Show Generator Component */}
          <ShowGenerator onGenerate={handleShowGeneration} />
        </div>

        {/* Show Details Panel */}
        {showDetails && selectedPreset && (
          <div className="bg-black/30 rounded-2xl p-6 border border-white/10 mb-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Show-Details & KI-Konfiguration
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* GPT Instructions */}
              <div>
                <h4 className="text-lg font-semibold text-blue-400 mb-2">🧠 KI-Anweisungen</h4>
                <div className="bg-black/50 rounded-lg p-4 border border-blue-500/20">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {selectedPreset.gpt_selection_instructions}
                  </p>
                </div>
              </div>

              {/* Configuration */}
              <div>
                <h4 className="text-lg font-semibold text-purple-400 mb-2">⚙️ Konfiguration</h4>
                <div className="space-y-3">
                  <div className="bg-black/50 rounded-lg p-3 border border-purple-500/20">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-400 text-sm">RSS Filter:</span>
                    </div>
                    <p className="text-gray-300 text-sm">{selectedPreset.rss_feed_filter}</p>
                  </div>
                  
                  <div className="bg-black/50 rounded-lg p-3 border border-green-500/20">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-400 text-sm">Sprecher Setup:</span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      Haupt: {selectedPreset.primary_speaker}
                      {selectedPreset.secondary_speaker && ` • Zweit: ${selectedPreset.secondary_speaker}`}
                      {selectedPreset.weather_speaker && ` • Wetter: ${selectedPreset.weather_speaker}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Live Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-black/30 rounded-xl p-6 border border-white/10">
            <h4 className="text-lg font-semibold text-green-400 mb-3">📊 Live Data</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Shows:</span>
                <span className="text-green-400">{shows.length} verfügbar</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Presets:</span>
                <span className="text-blue-400">{presets.length} aktiv</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Sprecher:</span>
                <span className="text-purple-400">{voices.length} verfügbar</span>
              </div>
            </div>
          </div>

          <div className="bg-black/30 rounded-xl p-6 border border-white/10">
            <h4 className="text-lg font-semibold text-blue-400 mb-3">🎯 Focus</h4>
            <div className="space-y-2">
              <div className="text-gray-300">
                <span className="text-gray-400">Stadt:</span> {selectedPreset?.city_focus || 'Global'}
              </div>
              <div className="text-gray-300">
                <span className="text-gray-400">Typ:</span> {selectedPreset?.display_name || 'Standard'}
              </div>
              <div className="text-gray-300">
                <span className="text-gray-400">Status:</span> <span className="text-green-400">Active</span>
              </div>
            </div>
          </div>

          <div className="bg-black/30 rounded-xl p-6 border border-white/10">
            <h4 className="text-lg font-semibold text-purple-400 mb-3">🔧 System</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Supabase:</span>
                <span className="text-green-400">Connected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Shows API:</span>
                <span className="text-green-400">{loading ? 'Loading...' : 'Ready'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Real-time:</span>
                <span className="text-green-400">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Current Show Script Preview */}
        {currentShow?.script_content && (
          <div className="bg-black/30 rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Radio className="w-5 h-5" />
              Show Script Preview
            </h3>
            <div className="bg-black/50 rounded-lg p-4 max-h-64 overflow-y-auto script-preview">
              <pre className="text-gray-300 text-sm whitespace-pre-wrap">
                {currentShow.script_content.substring(0, 1000)}
                {currentShow.script_content.length > 1000 && '...'}
              </pre>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-black/40 border-t border-white/10 backdrop-blur-xl p-6 text-center">
        <div className="text-gray-400 text-sm">
          <p>© 2024 RadioX AI • Powered by Supabase & ElevenLabs</p>
          <p className="mt-1 font-mono">
            Status: <span className="text-green-400">ONLINE</span> • 
            Version: <span className="text-blue-400">2.0.0</span> • 
            DB: <span className="text-purple-400">Supabase Direct</span>
          </p>
        </div>
      </footer>
    </div>
  )
} 