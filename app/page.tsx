'use client'

export default function HomePage() {
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