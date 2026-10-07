import https from 'https';

function testEnAudio(text: string): Promise<number> {
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=en-GB&client=tw-ob`;
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      let bytes = 0;
      res.on('data', chunk => bytes += chunk.length);
      res.on('end', () => resolve(bytes));
    }).on('error', reject);
  });
}

async function main() {
  console.log('Testing British audio fetch for IELTS vocab "ubiquitous"...');
  const bytes = await testEnAudio('ubiquitous');
  console.log(`British Audio fetched successfully! Size: ${bytes} bytes`);
}

main().catch(console.error);
