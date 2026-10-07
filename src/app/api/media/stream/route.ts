import { NextRequest, NextResponse } from 'next/server';
import { GoogleDriveService } from '@/services/google/drive.service';

// In-memory cache for media assets to prevent repeated Google Drive calls
const mediaCache = new Map<string, { buffer: Buffer; contentType: string }>();

/**
 * Thêm hiệu ứng hoạt họa viết nét (Stroke order animation) vào KanjiVG SVG chuẩn mực
 */
function animateKanjiSvg(rawSvg: string, kanjiChar: string): string {
  const pathMatches = rawSvg.match(/<path[^>]+id="kvg:[^"]+-s(\d+)"[^>]*>/g) || [];
  const strokeCount = pathMatches.length;

  let styledSvg = rawSvg.replace(/<path\s+id="kvg:([^"]+-s(\d+))"/g, (match, fullId, strokeNum) => {
    return `${match} class="kanji-stroke-anim stroke-${strokeNum}"`;
  });

  let css = `
<style>
  @keyframes drawStroke {
    0% {
      stroke-dashoffset: 400;
    }
    100% {
      stroke-dashoffset: 0;
    }
  }
  .kanji-stroke-anim {
    stroke: #9E3223 !important; /* Đỏ son Bengara truyền thống */
    stroke-width: 3.8 !important;
    stroke-linecap: round !important;
    stroke-linejoin: round !important;
    fill: none !important;
    stroke-dasharray: 400;
    stroke-dashoffset: 400;
    animation: drawStroke 0.65s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }
`;

  for (let i = 1; i <= Math.max(strokeCount, 30); i++) {
    const strokeDelay = ((i - 1) * 0.38).toFixed(2);
    css += `  .stroke-${i} { animation-delay: ${strokeDelay}s; }\n`;
  }
  css += `</style>\n`;

  const ghostStrokes = pathMatches
    .map((p) => p.replace(/id="[^"]*"/g, '').replace(/class="[^"]*"/g, '').replace(/<path/, '<path stroke="#E2DAC6" stroke-width="3" fill="none" opacity="0.6"'))
    .join('\n    ');
  const ghostGroup = ghostStrokes ? `  <g id="kvg:GhostBackgroundGuide">\n    ${ghostStrokes}\n  </g>\n` : '';

  styledSvg = styledSvg.replace(/<svg\s+([^>]+)>/, `<svg $1>\n${css}${ghostGroup}`);
  return styledSvg;
}

function sanitizeExistingSvg(svgStr: string): string {
  let cleaned = svgStr
    .replace(/stroke-dashoffset:\s*\d+\s*!important\s*;/g, 'stroke-dashoffset: 400;')
    .replace(/stroke-dasharray:\s*\d+\s*!important\s*;/g, 'stroke-dasharray: 400;')
    .replace(/stroke:\s*#16253B\s*!important/g, 'stroke: #9E3223 !important;');

  if (!cleaned.includes('@keyframes drawStroke')) {
    cleaned = cleaned.replace(/<style>/, `<style>\n  @keyframes drawStroke {\n    0% { stroke-dashoffset: 400; }\n    100% { stroke-dashoffset: 0; }\n  }\n`);
  }
  return cleaned;
}

function buildMediaResponse(request: NextRequest, buffer: Buffer, contentType: string, isHead: boolean = false) {
  const rangeHeader = request.headers.get('range');
  
  if (rangeHeader && rangeHeader.startsWith('bytes=')) {
    const parts = rangeHeader.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10) || 0;
    const end = parts[1] ? parseInt(parts[1], 10) : buffer.length - 1;
    const clampedEnd = Math.min(Math.max(0, end), buffer.length - 1);
    const chunk = buffer.subarray(start, clampedEnd + 1);

    return new NextResponse(isHead ? null : new Uint8Array(chunk), {
      status: 206,
      headers: {
        'Content-Type': contentType,
        'Content-Range': `bytes ${start}-${clampedEnd}/${buffer.length}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunk.length.toString(),
        'Content-Disposition': 'inline',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  return new NextResponse(isHead ? null : new Uint8Array(buffer), {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': 'inline',
      'Accept-Ranges': 'bytes',
      'Content-Length': buffer.length.toString(),
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export async function GET(request: NextRequest) {
  return handleMediaStream(request, false);
}

export async function HEAD(request: NextRequest) {
  return handleMediaStream(request, true);
}

async function handleMediaStream(request: NextRequest, isHead: boolean) {
  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get('fileId');
  const mimeTypeHint = searchParams.get('mimeType') || searchParams.get('mime');
  const kanjiChar = searchParams.get('kanji') || searchParams.get('char');

  // Trường hợp yêu cầu trực tiếp Kanji SVG theo ký tự Hán tự
  if (!fileId && kanjiChar) {
    const cacheKey = `kanji_char:${kanjiChar}`;
    const cached = mediaCache.get(cacheKey);
    if (cached) {
      return buildMediaResponse(request, cached.buffer, cached.contentType, isHead);
    }

    try {
      const hex = kanjiChar.charCodeAt(0).toString(16).padStart(5, '0');
      const kvgUrl = `https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/${hex}.svg`;
      const res = await fetch(kvgUrl, { signal: AbortSignal.timeout(8000) });
      if (res.ok) {
        const rawSvg = await res.text();
        const animatedSvg = animateKanjiSvg(rawSvg, kanjiChar);
        const buffer = Buffer.from(animatedSvg, 'utf-8');
        const contentType = 'image/svg+xml; charset=utf-8';
        mediaCache.set(cacheKey, { buffer, contentType });
        return buildMediaResponse(request, buffer, contentType, isHead);
      }
    } catch (err: any) {
      console.warn('[MediaStreamProxy] KanjiVG fetch error:', err.message);
    }
  }

  if (!fileId) {
    return new NextResponse('Missing fileId or kanji parameter', { status: 400 });
  }

  // 1. Check in-memory buffer cache
  const cached = mediaCache.get(fileId);
  if (cached) {
    return buildMediaResponse(request, cached.buffer, cached.contentType, isHead);
  }

  try {
    // 2. Try direct Google Drive UC stream download
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    const directRes = await fetch(downloadUrl, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (directRes.ok) {
      const arrayBuffer = await directRes.arrayBuffer();
      let buffer = Buffer.from(arrayBuffer);

      // Check if Drive returned an HTML redirect / error page instead of media
      const textPreview = buffer.slice(0, 100).toString('utf-8');
      const isHtmlPage = textPreview.includes('<!DOCTYPE html') || textPreview.includes('<html');

      if (!isHtmlPage) {
        // Determine proper Content-Type
        let contentType = mimeTypeHint || directRes.headers.get('content-type') || 'application/octet-stream';
        
        if (textPreview.includes('<?xml') || textPreview.includes('<svg') || mimeTypeHint?.includes('svg')) {
          contentType = 'image/svg+xml; charset=utf-8';
          // Tự động sửa lỗi CSS keyframes animation trên SVG nếu có !important
          const svgStr = buffer.toString('utf-8');
          const sanitized = sanitizeExistingSvg(svgStr);
          buffer = Buffer.from(sanitized, 'utf-8');
        } else if (
          textPreview.startsWith('ID3') ||
          (buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0) ||
          mimeTypeHint?.includes('audio') ||
          contentType.includes('audio')
        ) {
          contentType = 'audio/mpeg';
        } else if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
          contentType = 'image/png';
        } else if (buffer[0] === 0xff && buffer[1] === 0xd8) {
          contentType = 'image/jpeg';
        }

        // Store in LRU/Map cache (limit to 150 items to conserve memory)
        if (mediaCache.size > 150) {
          const firstKey = mediaCache.keys().next().value;
          if (firstKey) mediaCache.delete(firstKey);
        }
        mediaCache.set(fileId, { buffer, contentType });

        return buildMediaResponse(request, buffer, contentType, isHead);
      }
    }

    // 3. Dự phòng cấp 2: Nếu là Kanji SVG và Drive chưa sẵn sàng hoặc timeout, fetch từ KanjiVG GitHub
    if (kanjiChar || mimeTypeHint?.includes('svg')) {
      const charToFetch = kanjiChar || (fileId.match(/[\u4e00-\u9faf]/)?.[0]);
      if (charToFetch) {
        try {
          const hex = charToFetch.charCodeAt(0).toString(16).padStart(5, '0');
          const kvgUrl = `https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/${hex}.svg`;
          const kvgRes = await fetch(kvgUrl, { signal: AbortSignal.timeout(8000) });
          if (kvgRes.ok) {
            const rawSvg = await kvgRes.text();
            const animatedSvg = animateKanjiSvg(rawSvg, charToFetch);
            const buffer = Buffer.from(animatedSvg, 'utf-8');
            const contentType = 'image/svg+xml; charset=utf-8';
            mediaCache.set(fileId, { buffer, contentType });
            return buildMediaResponse(request, buffer, contentType, isHead);
          }
        } catch (kvgErr: any) {
          console.warn('[MediaStreamProxy] KanjiVG fallback failed:', kvgErr.message);
        }
      }
    }

    // 4. Fallback: Google Drive API with Service Account (if configured)
    try {
      const drive = GoogleDriveService.getDrive();
      const apiRes = await drive.files.get(
        { fileId, alt: 'media' },
        { responseType: 'arraybuffer' }
      );
      const buffer = Buffer.from(apiRes.data as ArrayBuffer);
      const contentType = mimeTypeHint || 'application/octet-stream';

      mediaCache.set(fileId, { buffer, contentType });

      return buildMediaResponse(request, buffer, contentType, isHead);
    } catch (authErr) {
      console.warn('[MediaStreamProxy] Drive API fallback failed:', authErr);
    }

    return new NextResponse('Media stream not found on Drive', { status: 404 });
  } catch (error: any) {
    console.error('[MediaStreamProxy] Error streaming file:', error);
    return new NextResponse(`Streaming error: ${error?.message || error}`, { status: 500 });
  }
}
