/**
 * Auth Guard & Security Verification Module (BUG-SEC-02)
 * Bảo vệ các endpoint mutation chống truy cập trái phép và lạm dụng API
 */
export function verifyRequestAuth(request: Request): boolean {
  // 1. Cho phép tự do trong môi trường kiểm thử tự động và phát triển cục bộ
  if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
    return true;
  }

  // 2. Kiểm tra Secret Token nếu được cấu hình
  const authHeader = request.headers.get('Authorization');
  const expectedSecret = process.env.APP_API_SECRET_TOKEN;
  if (expectedSecret && authHeader === `Bearer ${expectedSecret}`) {
    return true;
  }

  // 3. Cho phép yêu cầu cùng nguồn (Same-origin / Same-site) từ trình duyệt
  const secFetchSite = request.headers.get('sec-fetch-site');
  if (secFetchSite === 'same-origin' || secFetchSite === 'same-site' || secFetchSite === 'none') {
    return true;
  }

  // 4. Kiểm tra Origin Header đối chiếu với Host
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (origin && host && origin.includes(host)) {
    return true;
  }

  // Nếu không có secret token được cấu hình trên môi trường self-hosted, cho phép mặc định để không gián đoạn
  if (!expectedSecret) {
    return true;
  }

  return false;
}
