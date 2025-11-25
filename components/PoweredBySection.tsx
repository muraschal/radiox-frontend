import React from 'react';

const services: {
  name: string;
  // Local SVG/PNG path (e.g. '/icons/openai.svg') or null for pure text fallback
  src?: string;
  href?: string;
  alt?: string;
  imgClassName?: string;
}[] = [
  // --- Frontend Stack ---
  {
    name: 'React',
    src: '/icons/react.svg',
    href: 'https://react.dev',
    alt: 'React',
  },
  {
    name: 'Vite',
    src: '/icons/vite.svg',
    href: 'https://vitejs.dev',
    alt: 'Vite',
  },
  {
    name: 'TypeScript',
    src: '/icons/typescript.svg',
    href: 'https://www.typescriptlang.org',
    alt: 'TypeScript',
  },
  {
    name: 'Tailwind CSS',
    src: '/icons/tailwindcss.svg',
    href: 'https://tailwindcss.com',
    alt: 'Tailwind CSS',
  },

  // --- Backend Core ---
  {
    name: 'Python',
    src: '/icons/python.svg',
    href: 'https://www.python.org',
    alt: 'Python',
  },
  {
    name: 'FastAPI',
    src: '/icons/fastapi.svg',
    href: 'https://fastapi.tiangolo.com',
    alt: 'FastAPI',
  },
  {
    name: 'FFmpeg',
    src: '/icons/ffmpeg.svg',
    href: 'https://ffmpeg.org',
    alt: 'FFmpeg',
  },

  // --- AI & Content ---
  {
    name: 'OpenAI GPT',
    src: '/icons/openai.svg',
    href: 'https://openai.com',
    alt: 'OpenAI GPT',
  },
  {
    name: 'Google Gemini',
    src: '/icons/googlegemini.svg',
    href: 'https://ai.google.dev',
    alt: 'Google Gemini',
  },
  {
    name: 'ElevenLabs',
    src: '/icons/elevenlabs.svg',
    href: 'https://elevenlabs.io',
    alt: 'ElevenLabs',
  },
  {
    name: 'Jina AI',
    src: '/icons/jina.png', // local PNG fallback
    href: 'https://jina.ai',
    alt: 'Jina AI Reader',
    imgClassName: 'rounded-sm', // Jina avatar is square
  },

  // --- Data & APIs ---
  {
    name: 'CoinMarketCap',
    src: '/icons/coinmarketcap.svg',
    href: 'https://coinmarketcap.com',
    alt: 'CoinMarketCap',
  },
  {
    name: 'OpenWeather',
    src: '/icons/openweathermap.png', // local PNG fallback
    href: 'https://openweathermap.org',
    alt: 'OpenWeather',
    // Invert the dark Github avatar to look good on dark background
    imgClassName: 'filter invert', 
  },
  {
    name: 'X (Twitter)',
    src: '/icons/x.svg',
    href: 'https://developer.x.com',
    alt: 'X (Twitter)',
  },
  {
    name: 'Telegram',
    src: '/icons/telegram.svg',
    href: 'https://telegram.org',
    alt: 'Telegram',
  },

  // --- Infra & Tools ---
  {
    name: 'Supabase',
    src: '/icons/supabase.svg',
    href: 'https://supabase.com',
    alt: 'Supabase',
  },
  {
    name: 'Redis',
    src: '/icons/redis.svg',
    href: 'https://redis.io',
    alt: 'Redis',
  },
  {
    name: 'Vercel',
    src: '/icons/vercel.svg',
    href: 'https://vercel.com',
    alt: 'Vercel',
  },
  {
    name: 'Cloudflare',
    src: '/icons/cloudflare.svg',
    href: 'https://www.cloudflare.com',
    alt: 'Cloudflare',
  },
  {
    name: 'Docker',
    src: '/icons/docker.svg',
    href: 'https://www.docker.com',
    alt: 'Docker',
  },
  {
    name: 'GitHub Actions',
    src: '/icons/githubactions.svg',
    href: 'https://github.com/features/actions',
    alt: 'GitHub Actions',
  },
  {
    name: 'Tailscale',
    src: '/icons/tailscale.svg',
    href: 'https://tailscale.com',
    alt: 'Tailscale',
  },
  {
    name: 'Proxmox',
    src: '/icons/proxmox.svg',
    href: 'https://www.proxmox.com',
    alt: 'Proxmox',
  },
  {
    name: 'Cursor',
    src: '/icons/cursor.svg',
    href: 'https://www.cursor.com',
    alt: 'Cursor',
  },
];

export const PoweredBySection: React.FC = () => {
  return (
    <section className="mt-16 px-6 md:px-12 pb-12 text-gray-500">
      <div className="max-w-[1920px] mx-auto border-t border-white/10 pt-8">
        <p className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-8 text-center">
          Powered by
        </p>
        
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-10">
          {services.map((service) => (
            <div
              key={service.name}
              className="flex flex-col items-center justify-center gap-3 min-w-[80px] group"
            >
              {service.href ? (
                <a
                  href={service.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={service.alt || service.name}
                  className="
                    flex items-center justify-center w-12 h-12 p-2.5 
                    bg-white/5 border border-white/5 rounded-2xl 
                    group-hover:bg-white/10 group-hover:border-white/20 group-hover:scale-110 
                    transition-all duration-300 shadow-lg shadow-black/20
                  "
                >
                  {service.src ? (
                    <img
                      src={service.src}
                      alt={service.alt || service.name}
                      className={`w-full h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity ${service.imgClassName ?? ''}`}
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-[10px] font-bold text-gray-400 group-hover:text-white">
                      {service.name.substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </a>
              ) : (
                <div className="
                    flex items-center justify-center w-12 h-12 p-2.5 
                    bg-white/5 border border-white/5 rounded-2xl cursor-default
                ">
                   {service.src ? (
                    <img
                      src={service.src}
                      alt={service.alt || service.name}
                      className={`w-full h-full object-contain opacity-50 ${service.imgClassName ?? ''}`}
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-[10px] font-bold text-gray-500">
                      {service.name.substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
              )}
              
              <span className="text-[9px] font-bold uppercase tracking-widest text-gray-600 group-hover:text-gray-300 transition-colors text-center max-w-[100px]">
                {service.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
