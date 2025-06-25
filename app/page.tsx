'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, Download, Radio, Zap, Clock, Mic, Settings, Database, Brain, Headphones, Users, MapPin, List, Loader } from 'lucide-react'
import { useRadioXHybrid, type Show, type ShowDetails, type GenerateShowRequest } from './hooks/useRadioXHybrid'

// 🕐 CLIENT-ONLY CLOCK COMPONENT (Prevents Hydration Mismatch)
function LiveClock() {
  const [time, setTime] = useState('')

  useEffect(() => {
    // Only run on client-side
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString('de-CH'))
    }
    
    // Set initial time
    updateTime()
    
    // Update every second
    const interval = setInterval(updateTime, 1000)
    
    return () => clearInterval(interval)
  }, [])

  // Return empty string during SSR to prevent hydration mismatch
  return <>{time || '--:--:--'}</>
}

export default function HomePage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [showDetails, setShowDetails] = useState(false)
  const [selectedChannel, setSelectedChannel] = useState('zurich')
  const [newsCount, setNewsCount] = useState(3)
  const [primarySpeaker, setPrimarySpeaker] = useState('marcel')
  const [secondarySpeaker, setSecondarySpeaker] = useState('jarvis')
  const audioRef = useRef<HTMLAudioElement>(null)

  // Use RadioX Hybrid Hook
  const {
    shows,
    currentShow,
    isGenerating,
    isLoading,
    error,
    isOnline,
    generateShow,
    loadShow,
    clearError,
    formatDuration,
    getChannels,
    getSpeakers,
  } = useRadioXHybrid()

  const channels = getChannels()
  const speakers = getSpeakers()

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleGenerateShow = async () => {
    try {
      const request: GenerateShowRequest = {
        channel: selectedChannel,
        news_count: newsCount,
        language: 'de',
        primary_speaker: primarySpeaker,
        secondary_speaker: secondarySpeaker,
      }
      
      const result = await generateShow(request)
      if (result) {
        console.log('✅ Show generated successfully')
      } else {
        console.log('⚠️ Show generation temporarily unavailable')
      }
    } catch (error) {
      console.warn('Show generation error handled gracefully:', error)
    }
  }

  const handleLoadShow = async (show: Show) => {
    try {
      await loadShow(show.id)
    } catch (error) {
      console.error('Failed to load show:', error)
    }
  }

  // Auto-play when currentShow changes
  useEffect(() => {
    if (currentShow?.metadata?.audio_url && audioRef.current) {
      audioRef.current.load()
    }
  }, [currentShow])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950">
      {/* MVP Banner */}
      <div className="fixed top-0 right-0 bg-red-500 text-white font-bold text-xs uppercase tracking-wider transform rotate-45 origin-center z-50 w-32 h-8 flex items-center justify-center mt-4 -mr-8">
        MVP v5.1
      </div>

      {/* Error Toast */}
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-500/90 text-white px-6 py-3 rounded-lg backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span>{error}</span>
            <button onClick={clearError} className="ml-2 text-red-200 hover:text-white">×</button>
          </div>
        </div>
      )}

      {/* Header with Player Focus */}
      <header className="sticky top-0 z-40 bg-black/40 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Radio<span className="text-red-500">X</span><sup className="text-sm">AI</sup>
              </h1>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 ${isOnline ? 'bg-green-500' : 'bg-red-500'} rounded-full animate-pulse`} />
                <span className={`${isOnline ? 'text-green-400' : 'text-red-400'} text-sm font-medium`}>
                  {isOnline ? 'ONLINE' : 'OFFLINE'}
                </span>
              </div>
            </div>
            <div className="text-gray-400 text-sm font-mono">
              <LiveClock />
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
                  {currentShow?.broadcast_style || 'RadioX AI Radio'} - {currentShow?.metadata?.channel || 'Zürich'}
                </h2>
                <p className="text-gray-300 mb-2">
                  {currentShow && currentShow.metadata?.content_stats ? 
                    `${currentShow.metadata.content_stats.news_selected} News • ${currentShow.estimated_duration_minutes || 'N/A'} Min` : 
                    'Wähle eine Show oder generiere eine neue'
                  }
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1 text-blue-400">
                    <MapPin className="w-3 h-3" />
                    {currentShow?.metadata?.channel || selectedChannel}
                  </span>
                  <span className="flex items-center gap-1 text-purple-400">
                    <Users className="w-3 h-3" />
                    {currentShow?.metadata?.speakers?.primary?.name || primarySpeaker}
                    {currentShow?.metadata?.speakers?.secondary?.name && ` & ${currentShow.metadata.speakers.secondary.name}`}
                  </span>
                  <span className="flex items-center gap-1 text-green-400">
                    <Clock className="w-3 h-3" />
                    {currentShow?.metadata?.audio_duration ? formatDuration(currentShow.metadata.audio_duration) : '0:00'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  disabled={!currentShow?.metadata?.audio_url}
                  className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-white" />
                  ) : (
                    <Play className="w-8 h-8 text-white ml-1" />
                  )}
                </button>
              </div>
            </div>

            {/* Audio Controls */}
            <audio 
              ref={audioRef}
              onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
              onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
              onEnded={() => setIsPlaying(false)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="hidden"
            >
              {(currentShow?.metadata?.audio_url || currentShow?.audio_url) && (
                <source src={currentShow.metadata?.audio_url || currentShow.audio_url} type="audio/mpeg" />
              )}
            </audio>

            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-3 mb-4 cursor-pointer">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300 shadow-md"
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-gray-400" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => {
                      const newVolume = parseFloat(e.target.value)
                      setVolume(newVolume)
                      if (audioRef.current) audioRef.current.volume = newVolume
                    }}
                    className="w-24 accent-blue-500"
                  />
                </div>
                <div className="text-sm text-gray-400 font-mono">
                  {formatDuration(currentTime)} / {formatDuration(duration)}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowDetails(!showDetails)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Show Details"
                >
                  <Database className="w-4 h-4 text-gray-400" />
                </button>
                {currentShow?.metadata?.audio_url && (
                  <a 
                    href={currentShow.metadata.audio_url} 
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
        {/* Show Generation */}
        <div className="bg-black/30 rounded-2xl p-6 border border-white/10 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <Brain className="w-6 h-6 text-blue-400" />
                AI Show Generator
              </h3>
              <p className="text-gray-300">Erstelle eine personalisierte Radio Show mit aktuellen News von der RadioX API</p>
            </div>
            <button
              onClick={handleGenerateShow}
              disabled={isGenerating}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 shadow-lg"
            >
              {isGenerating ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Generiere Show...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Neue Show erstellen
                </>
              )}
            </button>
          </div>

          {/* Configuration */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Kanal</label>
              <select
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value)}
                className="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white"
              >
                {channels.map(channel => (
                  <option key={channel.id} value={channel.id}>{channel.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">News Anzahl</label>
              <select
                value={newsCount}
                onChange={(e) => setNewsCount(Number(e.target.value))}
                className="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white"
              >
                <option value={1}>1 News</option>
                <option value={2}>2 News</option>
                <option value={3}>3 News</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Haupt-Sprecher</label>
              <select
                value={primarySpeaker}
                onChange={(e) => setPrimarySpeaker(e.target.value)}
                className="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white"
              >
                {speakers.map(speaker => (
                  <option key={speaker.id} value={speaker.id}>{speaker.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Co-Sprecher</label>
              <select
                value={secondarySpeaker}
                onChange={(e) => setSecondarySpeaker(e.target.value)}
                className="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white"
              >
                {speakers.map(speaker => (
                  <option key={speaker.id} value={speaker.id}>{speaker.name}</option>
                ))}
              </select>
            </div>
          </div>

          {isGenerating && (
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center gap-3">
                <Mic className="w-5 h-5 text-blue-400 animate-pulse" />
                <div>
                  <p className="text-blue-300 font-medium">KI arbeitet an deiner Show...</p>
                  <p className="text-gray-400 text-sm">Sammle News → Generiere Script → Produziere Audio</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Shows List */}
        <div className="bg-black/30 rounded-2xl p-6 border border-white/10 mb-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <List className="w-5 h-5" />
            Verfügbare Shows ({shows.length})
          </h3>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="w-6 h-6 text-blue-400 animate-spin" />
              <span className="ml-2 text-gray-300">Lade Shows...</span>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {shows.map((show) => (
                <button
                  key={show.id}
                  onClick={() => handleLoadShow(show)}
                  className={`p-4 rounded-xl border transition-all text-left ${
                    currentShow?.session_id === show.id
                      ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <h4 className="font-semibold mb-1">{show.title}</h4>
                  <p className="text-sm opacity-80 mb-2">{show.script_preview}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                      {show.channel}
                    </span>
                    <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded">
                      {show.news_count} News
                    </span>
                    <span className="text-gray-400">
                      {new Date(show.created_at).toLocaleDateString('de-CH')}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Show Details Panel */}
        {showDetails && currentShow && (
          <div className="bg-black/30 rounded-2xl p-6 border border-white/10 mb-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Show-Details & Transkript
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Show Stats */}
              <div>
                <h4 className="text-lg font-semibold text-blue-400 mb-2">📊 Show-Statistiken</h4>
                <div className="bg-black/50 rounded-lg p-4 border border-blue-500/20 space-y-2">
                                     <div className="flex justify-between">
                     <span className="text-gray-400">News gesammelt:</span>
                     <span className="text-green-400">{currentShow.metadata?.content_stats?.total_news_collected || 'N/A'}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-gray-400">News ausgewählt:</span>
                     <span className="text-blue-400">{currentShow.metadata?.content_stats?.news_selected || 'N/A'}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-gray-400">Geschätzte Dauer:</span>
                     <span className="text-purple-400">{currentShow.estimated_duration_minutes || 'N/A'} Min</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-gray-400">Segmente:</span>
                     <span className="text-orange-400">{currentShow.segments?.length || 0}</span>
                   </div>
                </div>
              </div>

              {/* Script Preview */}
              <div>
                <h4 className="text-lg font-semibold text-purple-400 mb-2">📝 Script Preview</h4>
                                 <div className="bg-black/50 rounded-lg p-4 border border-purple-500/20 max-h-64 overflow-y-auto">
                   {currentShow.segments && currentShow.segments.length > 0 ? (
                     <>
                       {currentShow.segments.slice(0, 5).map((segment, index) => (
                         <div key={index} className="mb-3">
                           <span className="text-yellow-400 font-semibold uppercase text-sm">
                             {segment.speaker}:
                           </span>
                           <p className="text-gray-300 text-sm mt-1">{segment.text}</p>
                         </div>
                       ))}
                       {currentShow.segments.length > 5 && (
                         <p className="text-gray-500 text-sm italic">... und {currentShow.segments.length - 5} weitere Segmente</p>
                       )}
                     </>
                   ) : (
                     <p className="text-gray-500 text-sm italic">Keine Segmente verfügbar</p>
                   )}
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* Live Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-black/30 rounded-xl p-6 border border-white/10">
            <h4 className="text-lg font-semibold text-green-400 mb-3">📊 API Status</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">RadioX API:</span>
                <span className="text-green-400">Online</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Shows verfügbar:</span>
                <span className="text-blue-400">{shows.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Aktuelle Show:</span>
                <span className="text-purple-400">{currentShow ? 'Geladen' : 'Keine'}</span>
              </div>
            </div>
          </div>

          <div className="bg-black/30 rounded-xl p-6 border border-white/10">
            <h4 className="text-lg font-semibold text-blue-400 mb-3">🎯 Konfiguration</h4>
            <div className="space-y-2">
              <div className="text-gray-300">
                <span className="text-gray-400">Kanal:</span> {selectedChannel}
              </div>
              <div className="text-gray-300">
                <span className="text-gray-400">News:</span> {newsCount}
              </div>
              <div className="text-gray-300">
                <span className="text-gray-400">Sprecher:</span> {primarySpeaker} & {secondarySpeaker}
              </div>
            </div>
          </div>

          <div className="bg-black/30 rounded-xl p-6 border border-white/10">
            <h4 className="text-lg font-semibold text-purple-400 mb-3">🔧 System</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Frontend:</span>
                <span className="text-green-400">v5.1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">API:</span>
                <span className="text-green-400">v1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className="text-green-400">Live</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/40 border-t border-white/10 backdrop-blur-xl p-6 text-center mt-8">
        <div className="text-gray-400 text-sm">
          <p>© 2024 RadioX AI • Powered by Production API</p>
          <p className="mt-1 font-mono">
            Status: <span className="text-green-400">LIVE</span> • 
            API: <span className="text-blue-400">api.radiox.cloud</span> • 
            Version: <span className="text-purple-400">5.1.0</span>
          </p>
        </div>
      </footer>
    </div>
  )
} 