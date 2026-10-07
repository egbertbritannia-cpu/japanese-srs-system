import https from 'https';

function fetchUrl(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Kiokudo-Crawler' } }, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve, reject);
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  const char = '東';
  const hex = char.charCodeAt(0).toString(16).padStart(5, '0');
  const url = `https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/${hex}.svg`;
  console.log(`Fetching ${char} (${hex}) from ${url}...`);
  const svg = await fetchUrl(url);
  console.log(`Fetched SVG successfully! Length: ${svg.length} chars`);
  console.log('Snippet:', svg.substring(0, 300));
}

main().catch(console.error);
