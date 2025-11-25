import fs from 'fs';
import https from 'https';
import path from 'path';

const downloadDir = path.join(process.cwd(), 'public', 'icons');

// OpenWeatherMap (GitHub Avatar fallback)
const openWeatherUrl = 'https://avatars.githubusercontent.com/u/1743227?s=200&v=4';
const openWeatherDest = path.join(downloadDir, 'openweathermap.png');

// Jina AI (Logo from GitHub/Web fallback if simpleicons fails)
// Let's use their official doc logo or similar if possible, or just a text placeholder in UI.
// For now, let's skip Jina image download and rely on UI text fallback or use a generic "AI" icon locally.
// But user wants "klauen" -> let's try to fetch Jina logo from their github avatar too.
const jinaUrl = 'https://avatars.githubusercontent.com/u/60539444?s=200&v=4';
const jinaDest = path.join(downloadDir, 'jina.png');

async function download(url, dest) {
    const file = fs.createWriteStream(dest);
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if(res.statusCode !== 200) {
                reject(new Error(`Status ${res.statusCode}`));
                return;
            }
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`Downloaded ${path.basename(dest)}`);
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => {});
            reject(err);
        });
    });
}

async function main() {
    try {
        await download(openWeatherUrl, openWeatherDest);
        await download(jinaUrl, jinaDest);
    } catch (e) {
        console.error(e);
    }
}

main();

