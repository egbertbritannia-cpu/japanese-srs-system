/**
 * In-Memory Sliding Window Rate Limiter (BUG-SEC-05)
 * Ngăn chặn cạn kiệt tài nguyên CPU và hạn ngạch API Gemini / FSRS
 */

interface RateLimitEntry {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Tự động dọn dẹp các mục cũ mỗi 5 phút
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap.entries()) {
      entry.timestamps = entry.timestamps.filter((ts) => now - ts < 60000);
      if (entry.timestamps.length === 0) {
        rateLimitMap.delete(key);
      }
    }
  }, 300000);
}

/**
 * Kiểm tra giới hạn tần suất truy vấn
 * @param identifier IP hoặc Client ID
 * @param maxRequests Số request tối đa
 * @param windowMs Cửa sổ thời gian (mặc định 60s)
 */
export function checkRateLimit(
  identifier: string,
  maxRequests: number = 30,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetMs: number } {
  // Bỏ qua rate limit trong môi trường test
  if (process.env.NODE_ENV === 'test') {
    return { allowed: true, remaining: maxRequests, resetMs: 0 };
  }

  const now = Date.now();
  let entry = rateLimitMap.get(identifier);

  if (!entry) {
    entry = { timestamps: [] };
    rateLimitMap.set(identifier, entry);
  }

  // Lọc các timestamp nằm ngoài cửa sổ thời gian
  entry.timestamps = entry.timestamps.filter((ts) => now - ts < windowMs);

  if (entry.timestamps.length >= maxRequests) {
    const oldest = entry.timestamps[0];
    const resetMs = Math.max(0, windowMs - (now - oldest));
    return {
      allowed: false,
      remaining: 0,
      resetMs,
    };
  }

  entry.timestamps.push(now);
  return {
    allowed: true,
    remaining: maxRequests - entry.timestamps.length,
    resetMs: windowMs,
  };
}
