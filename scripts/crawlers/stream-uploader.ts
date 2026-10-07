import https from 'https';
import http from 'http';
import { URL } from 'url';
import { Readable, PassThrough } from 'stream';
import { DriveFolderManager, AssetEntry, MultimodalCategory } from './drive-folder-manager';

export interface StreamUploadOptions {
  url: string;
  key: string;
  category: MultimodalCategory | string;
  fileName: string;
  mimeType: string;
  folderId: string;
  metadata?: Record<string, any>;
  headers?: Record<string, string>;
  maxRetries?: number;
  shardId?: string;
}

/**
 * Helper to fetch a URL as a Node.js Readable stream, following redirects.
 */
function fetchHttpStream(
  targetUrl: string,
  customHeaders: Record<string, string> = {},
  redirectCount = 0
): Promise<{ stream: Readable; statusCode: number; headers: http.IncomingHttpHeaders; contentLength?: number }> {
  return new Promise((resolve, reject) => {
    if (redirectCount > 5) {
      reject(new Error(`Too many redirects for URL: ${targetUrl}`));
      return;
    }

    const parsed = new URL(targetUrl);
    const client = parsed.protocol === 'https:' ? https : http;

    const req = client.get(
      targetUrl,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept': '*/*',
          ...customHeaders,
        },
      },
      (res) => {
        if (
          res.statusCode &&
          [301, 302, 303, 307, 308].includes(res.statusCode) &&
          res.headers.location
        ) {
          const redirectUrl = new URL(res.headers.location, targetUrl).toString();
          res.resume(); // consume stream to free memory
          return fetchHttpStream(redirectUrl, customHeaders, redirectCount + 1)
            .then(resolve)
            .catch(reject);
        }

        if (!res.statusCode || res.statusCode < 200 || res.statusCode >= 300) {
          res.resume();
          reject(new Error(`HTTP ${res.statusCode} for ${targetUrl}`));
          return;
        }

        const lenHeader = res.headers['content-length'];
        const contentLength = lenHeader ? parseInt(lenHeader, 10) : undefined;
        resolve({
          stream: res,
          statusCode: res.statusCode,
          headers: res.headers,
          contentLength,
        });
      }
    );

    req.on('error', reject);
    req.setTimeout(60000, () => {
      req.destroy(new Error(`Timeout fetching ${targetUrl}`));
    });
  });
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class StreamUploader {
  /**
   * Tải tệp từ URL ngoài và truyền thẳng (PassThrough Stream) lên Google Drive
   * TUYỆT ĐỐI 0 BYTE GHI XUỐNG Ổ CỨNG CỤC BỘ.
   */
  static async streamUploadFromUrl(options: StreamUploadOptions): Promise<AssetEntry> {
    const shard = options.shardId || process.env.WORKER_SHARD_ID;
    if (DriveFolderManager.hasAsset(options.key)) {
      const existing = DriveFolderManager.getAsset(options.key);
      if (existing) return existing;
    }

    const partition = DriveFolderManager.getPartition(options.category, shard);
    if (partition.assets[options.key]) {
      return partition.assets[options.key];
    }

    const maxRetries = options.maxRetries ?? 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      attempt++;
      try {
        const { stream, contentLength } = await fetchHttpStream(
          options.url,
          options.headers || {}
        );

        // Upload trực tiếp stream vào Google Drive API
        const entry = await DriveFolderManager.uploadAndRegister({
          key: options.key,
          category: options.category,
          fileName: options.fileName,
          mimeType: options.mimeType,
          content: stream,
          folderId: options.folderId,
          sizeBytes: contentLength,
          shardId: shard,
          metadata: {
            ...options.metadata,
            sourceUrl: options.url,
          },
        });

        return entry;
      } catch (err: any) {
        const isLastAttempt = attempt >= maxRetries;
        if (isLastAttempt) {
          throw new Error(
            `StreamUpload failed after ${attempt} attempts for ${options.key}: ${err.message}`
          );
        }
        const backoffMs = attempt * 1000 + Math.random() * 500;
        await delay(backoffMs);
      }
    }

    throw new Error(`Unexpected failure streaming ${options.key}`);
  }

  /**
   * Thực thi tác vụ theo hàng đợi với giới hạn luồng song song (Concurrency Queue)
   * Tránh lỗi Google Drive 429 Rate Limit.
   */
  static async mapConcurrent<T, R>(
    items: T[],
    concurrency: number,
    worker: (item: T, index: number) => Promise<R>
  ): Promise<R[]> {
    const results: R[] = new Array(items.length);
    let currentIndex = 0;

    const runWorker = async (): Promise<void> => {
      while (currentIndex < items.length) {
        const index = currentIndex++;
        try {
          results[index] = await worker(items[index], index);
        } catch (err) {
          // Worker handles logging, result remains undefined
        }
      }
    };

    const workers = Array.from(
      { length: Math.min(concurrency, items.length) },
      () => runWorker()
    );

    await Promise.all(workers);
    return results;
  }
}
