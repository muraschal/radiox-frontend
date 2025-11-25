import React from 'react';

const services: {
  name: string;
  type: 'logo' | 'mono';
  src?: string;
  href?: string;
  alt?: string;
  imgClassName?: string;
}[] = [
  // AI & dev
  {
    name: 'OpenAI GPT',
    type: 'logo',
    src: 'https://cdn.simpleicons.org/openai/ffffff',
    href: 'https://openai.com',
    alt: 'OpenAI GPT logo – generative AI used for RadioX automation and content understanding',
  },
  {
    name: 'Google Gemini',
    type: 'logo',
    src: 'https://cdn.simpleicons.org/googlegemini/ffffff',
    href: 'https://ai.google.dev/gemini-api',
    alt: 'Google Gemini logo – multimodal AI model powering RadioX features',
  },
  {
    name: 'ElevenLabs',
    type: 'logo',
    src: 'https://cdn.simpleicons.org/elevenlabs/ffffff',
    href: 'https://elevenlabs.io',
    alt: 'ElevenLabs logo – speech and voice synthesis for RadioX',
  },
  {
    name: 'Cursor',
    type: 'logo',
    src: 'https://cdn.simpleicons.org/cursor/ffffff',
    href: 'https://www.cursor.com',
    alt: 'Cursor logo – AI coding environment used to build RadioX',
  },
  {
    name: 'JIA AI Reader',
    type: 'mono',
    alt: 'JIA AI Reader – custom AI-powered article reader for RadioX',
  },
  // Data & APIs
  {
    name: 'CoinMarketCap',
    type: 'logo',
    src: 'https://cdn.simpleicons.org/coinmarketcap/ffffff',
    href: 'https://coinmarketcap.com',
    alt: 'CoinMarketCap logo – cryptocurrency market data for RadioX shows',
  },
  {
    name: 'OpenWeather',
    type: 'logo',
    // Official GitHub avatar, normalized to white via CSS filters
    src: 'https://avatars.githubusercontent.com/u/1743227?s=200&v=4',
    href: 'https://openweathermap.org',
    alt: 'OpenWeather logo – weather and climate data used by RadioX',
    imgClassName: 'filter grayscale invert brightness-200',
  },
  {
    name: 'X (Twitter) API',
    type: 'logo',
    src: 'https://cdn.simpleicons.org/x/ffffff',
    href: 'https://developer.x.com',
    alt: 'X (Twitter) logo – social media content and news signals for RadioX',
  },
  {
    name: 'Telegram',
    type: 'logo',
    src: 'https://cdn.simpleicons.org/telegram/ffffff',
    href: 'https://telegram.org',
    alt: 'Telegram logo – messaging integrations for RadioX news sources',
  },
  // Runtime & infra
  {
    name: 'Supabase',
    type: 'logo',
    src: 'https://cdn.simpleicons.org/supabase/ffffff',
    href: 'https://supabase.com',
    alt: 'Supabase logo – Postgres database and authentication for RadioX',
  },
  {
    name: 'Redis',
    type: 'logo',
    src: 'https://cdn.simpleicons.org/redis/ffffff',
    href: 'https://redis.io',
    alt: 'Redis logo – high performance caching layer for RadioX',
  },
  {
    name: 'Vercel',
    type: 'logo',
    src: 'https://cdn.simpleicons.org/vercel/ffffff',
    href: 'https://vercel.com',
    alt: 'Vercel logo – edge hosting platform for the RadioX frontend',
  },
  {
    name: 'Cloudflare',
    type: 'logo',
    src: 'https://cdn.simpleicons.org/cloudflare/ffffff',
    href: 'https://www.cloudflare.com',
    alt: 'Cloudflare logo – CDN and security layer in front of RadioX',
  },
  {
    name: 'Docker',
    type: 'logo',
    src: 'https://cdn.simpleicons.org/docker/ffffff',
    href: 'https://www.docker.com',
    alt: 'Docker logo – containerization platform for RadioX services',
  },
  {
    name: 'Proxmox',
    type: 'logo',
    src: 'https://cdn.simpleicons.org/proxmox/ffffff',
    href: 'https://www.proxmox.com',
    alt: 'Proxmox logo – virtualization platform for RadioX infrastructure',
  },
];

export const PoweredBySection: React.FC = () => {
  return (
    <section className="mt-16 px-6 md:px-12 pb-8 text-gray-500">
      <div className="max-w-[1920px] mx-auto border-t border-white/10 pt-8">
        <p className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-4">
          Powered by
        </p>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
          {services.map((service) => (
            <div
              key={service.name}
              className="flex flex-col items-center justify-center gap-2 min-w-[72px]"
            >
              {service.href ? (
                <a
                  href={service.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={service.alt || service.name}
                  className="inline-flex items-center justify-center"
                >
                  {service.type === 'logo' && service.src ? (
                    <img
                      src={service.src}
                      alt={service.alt || `${service.name} logo`}
                      className={`h-6 w-auto opacity-80 hover:opacity-100 transition-opacity ${service.imgClassName ?? ''}`}
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-lg border border-white/20 bg-white/5 flex items-center justify-center text-[10px] font-bold tracking-[0.12em] text-gray-900">
                      JIA
                    </div>
                  )}
                </a>
              ) : service.type === 'logo' && service.src ? (
                <img
                  src={service.src}
                  alt={service.alt || `${service.name} logo`}
                  className={`h-6 w-auto opacity-80 hover:opacity-100 transition-opacity ${service.imgClassName ?? ''}`}
                  loading="lazy"
                />
              ) : (
                    <div className="h-8 w-8 rounded-lg border border-white/40 bg-transparent flex items-center justify-center text-[11px] font-extrabold tracking-[0.16em] text-white">
                  JIA
                </div>
              )}
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-300">
                {service.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


