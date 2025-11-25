import fs from 'fs';
import https from 'https';
import path from 'path';

const icons = [
  // Existing
  { name: 'openai', url: 'https://cdn.simpleicons.org/openai/ffffff' },
  { name: 'googlegemini', url: 'https://cdn.simpleicons.org/googlegemini/ffffff' },
  { name: 'elevenlabs', url: 'https://cdn.simpleicons.org/elevenlabs/ffffff' },
  { name: 'cursor', url: 'https://cdn.simpleicons.org/cursor/ffffff' },
  { name: 'jina', url: 'https://cdn.simpleicons.org/jina/ffffff' }, // Jina AI (war JIA)
  { name: 'coinmarketcap', url: 'https://cdn.simpleicons.org/coinmarketcap/ffffff' },
  { name: 'openweathermap', url: 'https://cdn.simpleicons.org/openweathermap/ffffff' },
  { name: 'x', url: 'https://cdn.simpleicons.org/x/ffffff' },
  { name: 'telegram', url: 'https://cdn.simpleicons.org/telegram/ffffff' },
  { name: 'supabase', url: 'https://cdn.simpleicons.org/supabase/ffffff' },
  { name: 'redis', url: 'https://cdn.simpleicons.org/redis/ffffff' },
  { name: 'vercel', url: 'https://cdn.simpleicons.org/vercel/ffffff' },
  { name: 'cloudflare', url: 'https://cdn.simpleicons.org/cloudflare/ffffff' },
  { name: 'docker', url: 'https://cdn.simpleicons.org/docker/ffffff' },
  { name: 'proxmox', url: 'https://cdn.simpleicons.org/proxmox/ffffff' },
  
  // New Techs
  { name: 'react', url: 'https://cdn.simpleicons.org/react/ffffff' },
  { name: 'vite', url: 'https://cdn.simpleicons.org/vite/ffffff' },
  { name: 'typescript', url: 'https://cdn.simpleicons.org/typescript/ffffff' },
  { name: 'tailwindcss', url: 'https://cdn.simpleicons.org/tailwindcss/ffffff' },
  { name: 'python', url: 'https://cdn.simpleicons.org/python/ffffff' },
  { name: 'fastapi', url: 'https://cdn.simpleicons.org/fastapi/ffffff' },
  { name: 'ffmpeg', url: 'https://cdn.simpleicons.org/ffmpeg/ffffff' },
  { name: 'githubactions', url: 'https://cdn.simpleicons.org/githubactions/ffffff' },
  { name: 'tailscale', url: 'https://cdn.simpleicons.org/tailscale/ffffff' },
];

const downloadDir = path.join(process.cwd(), 'public', 'icons');

if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir, { recursive: true });
}

async function downloadIcon(name, url) {
  const dest = path.join(downloadDir, `${name}.svg`);
  const file = fs.createWriteStream(dest);

  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to fetch ${url}: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${name}.svg`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  console.log('Downloading icons to public/icons...');
  for (const icon of icons) {
    try {
      await downloadIcon(icon.name, icon.url);
    } catch (err) {
      console.error(`Error downloading ${icon.name}:`, err.message);
    }
  }
  console.log('Done.');
}

main();
