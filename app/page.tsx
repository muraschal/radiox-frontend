'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, Download, Radio, Zap, Clock, Mic } from 'lucide-react'

export default function HomePage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

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
      // Call the show generation API
      const response = await fetch('/api/generate-show', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preset: 'zurich', duration_minutes: 3 })
      })
      const data = await response.json()
      console.log('Show generated:', data)
    } catch (error) {
      console.error('Generation failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* MVP Banner */}
      <div className="fixed top-0 right-0 bg-red-500 text-white font-bold text-xs uppercase tracking-wider transform rotate-45 origin-center z-50 w-32 h-8 flex items-center justify-center mt-4 -mr-8">
        MVP v4.0
      </div>

      {/* Header */}
      <header className="relative z-20 bg-black/20 border border-white/10 backdrop-blur-xl p-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-black mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Radio<span className="text-red-500">X</span><sup className="text-2xl">AI</sup>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 font-light italic mb-6">
            Your Radio, Just Got Smarter.
          </p>
          <div className="inline-block bg-black/30 px-4 py-2 rounded-full border border-white/20 font-mono text-sm text-gray-400">
            Generated: {new Date().toLocaleDateString('de-CH')}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="py-20 px-8">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white">
              🎵 Live AI Radio Show
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              AI-generated. Enterprise quality. Zero compromise. 
              It's the future, and it's loud.
            </p>

            {/* Coming Soon Card */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-12 backdrop-blur-xl max-w-2xl mx-auto">
              <div className="text-6xl mb-6">🚀</div>
              <h3 className="text-3xl font-bold mb-4 text-blue-400">
                radiox.cloud ist LIVE!
              </h3>
              <p className="text-gray-300 mb-8">
                Domain erfolgreich konfiguriert. 
                <br />
                Microservices Backend läuft.
                <br />
                Frontend wird ausgebaut...
              </p>
              
              {/* Status Indicators */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4">
                  <div className="text-green-400 font-mono text-sm">✅ Domain</div>
                  <div className="text-white font-semibold">radiox.cloud</div>
                </div>
                <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4">
                  <div className="text-green-400 font-mono text-sm">✅ Backend</div>
                  <div className="text-white font-semibold">8 Microservices</div>
                </div>
                <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4">
                  <div className="text-yellow-400 font-mono text-sm">🚧 Frontend</div>
                  <div className="text-white font-semibold">In Entwicklung</div>
                </div>
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4">
                  <div className="text-blue-400 font-mono text-sm">📡 API</div>
                  <div className="text-white font-semibold">Bald verfügbar</div>
                </div>
              </div>

              <div className="text-sm text-gray-500 font-mono">
                Next.js 14 • React 18 • Tailwind CSS • Vercel
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="py-16 px-8 bg-black/20">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-12 text-white">
              🔧 Powered by Modern Tech
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: 'Next.js 14', emoji: '⚡' },
                { name: 'Supabase', emoji: '🗄️' },
                { name: 'OpenAI GPT-4', emoji: '🤖' },
                { name: 'Docker', emoji: '🐳' },
                { name: 'Cloudflare', emoji: '☁️' },
                { name: 'ElevenLabs', emoji: '🎤' },
                { name: 'TypeScript', emoji: '📘' },
                { name: 'Tailwind', emoji: '🎨' },
              ].map((tech, index) => (
                <div 
                  key={index} 
                  className="bg-white/5 border border-white/10 rounded-xl p-4 text-center backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                >
                  <div className="text-2xl mb-2">{tech.emoji}</div>
                  <div className="text-sm text-gray-300">{tech.name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Live Player Section */}
        <section className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="glassmorphism p-8 mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Radio className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">🔴 LIVE NOW</h2>
                  <p className="text-gray-300">18:00 Zürich Premium Show</p>
                </div>
                <div className="ml-auto">
                  <span className="px-3 py-1 bg-red-500 text-white text-sm rounded-full animate-pulse">
                    ON AIR
                  </span>
                </div>
              </div>

              {/* Audio Player */}
              <div className="bg-black/30 rounded-xl p-6 mb-6">
                <audio 
                  ref={audioRef}
                  onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                  onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                  onEnded={() => setIsPlaying(false)}
                  className="hidden"
                >
                  <source src="/api/audio/zurich_18uhr_premium.mp3" type="audio/mpeg" />
                </audio>

                {/* Progress Bar */}
                <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={togglePlay}
                      className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6 text-white" />
                      ) : (
                        <Play className="w-6 h-6 text-white ml-1" />
                      )}
                    </button>

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
                        className="w-20 accent-blue-500"
                      />
                    </div>

                    <div className="text-sm text-gray-400">
                      {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')} / 
                      {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <Download className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Show Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Aktuelle Sendung</h3>
                  <p className="text-gray-300 mb-4">
                    Marcel & Jarvis diskutieren Web3-Technologie, Crypto Spoofing und die neuesten Bitcoin-Entwicklungen. 
                    Plus lokale News aus Zürich!
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">Bitcoin</span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">Web3</span>
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">Zürich</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Live Stats</h3>
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
                      <span className="text-gray-400">Sendung:</span>
                      <span className="text-purple-400">5 Min Premium</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Generate New Show */}
            <div className="glassmorphism p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">🎬 Neue Show generieren</h3>
                  <p className="text-gray-300">Erstelle eine fresh AI-Radio Show mit aktuellen News</p>
                </div>
                <button
                  onClick={generateShow}
                  disabled={isGenerating}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generiere...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Generate Show
                    </>
                  )}
                </button>
              </div>

              {isGenerating && (
                <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mic className="w-5 h-5 text-blue-400 animate-pulse" />
                    <div>
                      <p className="text-blue-300 font-medium">AI arbeitet...</p>
                      <p className="text-gray-400 text-sm">Sammle News, generiere Script, produziere Audio...</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-20 bg-black/40 border-t border-white/10 backdrop-blur-xl p-8 text-center">
        <div className="text-gray-400 text-sm">
          <p>© 2024 RadioX AI • Made with ❤️ in Switzerland</p>
          <p className="mt-2 font-mono">
            Status: <span className="text-green-400">ONLINE</span> • 
            Version: <span className="text-blue-400">4.0.0</span>
          </p>
        </div>
      </footer>
    </div>
  )
} 