'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, Download, Radio, Zap, Clock, Mic, Settings, Database, Brain, Headphones, Users, MapPin } from 'lucide-react'

// Supabase types
interface ShowPreset {
  id: string;
  preset_name: string;
  display_name: string;
  description: string;
  city_focus: string;
  primary_speaker: string;
  secondary_speaker?: string;
  weather_speaker?: string;
  gpt_selection_instructions: string;
  rss_feed_filter: string;
}

interface BroadcastLog {
  id: string;
  show_title?: string;
  show_description?: string;
  script_content?: string;
  news_data?: any;
  show_style?: string;
  audio_file_url?: string;
  audio_duration_seconds?: number;
  preset_name?: string;
  timestamp: string;
}

export default function HomePage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentShow, setCurrentShow] = useState<BroadcastLog | null>(null)
  const [showPresets, setShowPresets] = useState<ShowPreset[]>([])
  const [selectedPreset, setSelectedPreset] = useState<ShowPreset | null>(null)
  const [audioFile, setAudioFile] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Load show presets on mount
  useEffect(() => {
    loadShowPresets()
    loadLatestShow()
  }, [])

  const loadShowPresets = async () => {
    try {
      const response = await fetch('/api/show-presets')
      if (response.ok) {
        const presets = await response.json()
        setShowPresets(presets)
        if (presets.length > 0) {
          setSelectedPreset(presets[0]) // Default to first preset
        }
      }
    } catch (error) {
      console.error('Failed to load presets:', error)
    }
  }

  const loadLatestShow = async () => {
    try {
      const response = await fetch('/api/latest-show')
      if (response.ok) {
        const show = await response.json()
        setCurrentShow(show)
      }
    } catch (error) {
      console.error('Failed to load latest show:', error)
    }
  }

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

  const generateShow = async () => {
    setIsGenerating(true)
    try {
      // Step 1: Generate show script
      const showResponse = await fetch('/api/generate-show', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          preset: selectedPreset?.preset_name || 'zurich', 
          duration_minutes: 3 
        })
      })
      const showData = await showResponse.json()
      console.log('Show generated:', showData)
      setCurrentShow(showData)

      if (showData.success && showData.script_content) {
        // Step 2: Generate audio from script
        const audioResponse = await fetch('/api/generate-audio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            script_content: showData.script_content,
            session_id: showData.session_id,
            voice_quality: 'high'
          })
        })
        const audioData = await audioResponse.json()
        console.log('Audio generated:', audioData)
        
        if (audioData.success && audioData.audio_filename) {
          setAudioFile(audioData.audio_filename)
          // Reload audio element with new file
          if (audioRef.current) {
            audioRef.current.load()
          }
        }
      }
    } catch (error) {
      console.error('Generation failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

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
              {new Date().toLocaleTimeString('de-CH')}
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
                  {currentShow?.show_title || `${selectedPreset?.display_name || 'Aktuelle Show'}`}
                </h2>
                <p className="text-gray-300 mb-2">
                  {currentShow?.show_description || selectedPreset?.description || 'AI-generierte Radio Show'}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1 text-blue-400">
                    <MapPin className="w-3 h-3" />
                    {selectedPreset?.city_focus || 'Global'}
                  </span>
                  <span className="flex items-center gap-1 text-purple-400">
                    <Users className="w-3 h-3" />
                    {selectedPreset?.primary_speaker}{selectedPreset?.secondary_speaker && ` & ${selectedPreset.secondary_speaker}`}
                  </span>
                  <span className="flex items-center gap-1 text-green-400">
                    <Clock className="w-3 h-3" />
                    {duration ? formatTime(duration) : '3:00'} Min
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
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
              className="hidden"
            >
              {audioFile && <source src={`/api/audio/${audioFile}`} type="audio/mpeg" />}
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
                  {formatTime(currentTime)} / {formatTime(duration)}
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
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Download">
                  <Download className="w-4 h-4 text-gray-400" />
                </button>
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
              <p className="text-gray-300">Erstelle eine personalisierte Radio Show mit aktuellen News und KI-generierten Inhalten</p>
            </div>
            <button
              onClick={generateShow}
              disabled={isGenerating}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 shadow-lg"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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

          {/* Preset Selection */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {showPresets.map((preset) => (
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
            ))}
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
                <span className="text-gray-400">Bitcoin:</span>
                <span className="text-green-400">$105,351.03 (+3.9%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Wetter Zürich:</span>
                <span className="text-blue-400">30°C ☀️</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Preset:</span>
                <span className="text-purple-400">{selectedPreset?.preset_name || 'none'}</span>
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
                <span className="text-gray-400">API:</span>
                <span className="text-green-400">Online</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Supabase:</span>
                <span className="text-green-400">Connected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">ElevenLabs:</span>
                <span className="text-green-400">Ready</span>
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
            <div className="bg-black/50 rounded-lg p-4 max-h-64 overflow-y-auto">
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
          <p>© 2024 RadioX AI • Powered by OpenAI & ElevenLabs</p>
          <p className="mt-1 font-mono">
            Status: <span className="text-green-400">ONLINE</span> • 
            Version: <span className="text-blue-400">5.0.0</span> • 
            DB: <span className="text-purple-400">Supabase Connected</span>
          </p>
        </div>
      </footer>
    </div>
  )
} 