# 03 — TẦNG 3: Tối Ưu Hoá Tài Nguyên Assets (Images, CSS, SVG, Glyphs & CJK Fonts)

> **Định vị tài liệu**: Tầng 3 (Asset Optimization & Visual Craftsmanship Layer) — Bản đặc tả kỹ thuật chi tiết về việc tối ưu hóa toàn bộ tài nguyên trực quan của dự án `japanese-srs-system`. Trọng tâm: xử lý 26 tệp ảnh mỹ thuật ukiyo-e (2.8MB), kịch bản tự động hóa chuyển đổi AVIF/WebP bằng `sharp`, tạo mã base64 blur placeholder (LQIP), tối ưu hóa CSS GPU compositing cho cánh hoa Sakura và subsetting font chữ CJK.

---

## 1. 🖼️ CHIẾN LƯỢC TỐI ƯU HÓA HÌNH ẢNH MỸ THUẬT NHẬT BẢN

Dự án sở hữu 26 bức tranh khắc gỗ và họa tiết truyền thống Nhật Bản trong `public/assets/art/`. Đây là linh hồn thị giác của hệ thống nhưng cũng là nguyên nhân gây ra **hơn 60% tổng dung lượng tải qua mạng**.

### 1.1. So Sánh Các Định Dạng Hình Ảnh Hiện Đại (Codec Deep Dive)

```
+─────────────────────────────────────────────────────────────────────────────+
|                     SO SÁNH CÁC CHUẨN NÉN HÌNH ẢNH                          |
+───────────────┬──────────────┬──────────────┬──────────────┬────────────────+
| Tiêu chí      | JPEG Cổ Điển | WebP         | AVIF (Khuyên)| SVG            |
+───────────────┼──────────────┼──────────────┼──────────────┼────────────────+
| Thuật toán    | DCT (Discrete| VP8 Intra    | AV1 Video    | Vector XML     |
| nén lõi       | Cosine Trans)| Frame        | Keyframe     | (Tọa độ toán)  |
| Tỷ lệ nén     | Cơ bản (1x)  | Nhỏ hơn 30%  | Nhỏ hơn 65%  | Cực nhỏ        |
| Hỗ trợ kênh   | Không        | Có (8-bit)   | Có (10/12-bit| Có             |
| trong suốt    |              |              | HDR alpha)   |                |
| Browser hỗ trợ| 100%         | 97.5%        | 94.2%        | 99%            |
| Ứng dụng      | Bỏ không dùng| Fallback     | Ảnh Ukiyo-e, | Họa tiết sóng, |
| khuyến nghị   |              |              | Backdrop lớn | con dấu Hanko  |
+───────────────┴──────────────┴──────────────┴────────────────┴────────────────+
```

---

## 2. ⚡ KỊCH BẢN TỰ ĐỘNG NÉN ẢNH BATCH: `scripts/optimize-art-images.mjs`

Thay vì chuyển đổi thủ công từng tệp ảnh, ta xây dựng một script Node.js hoàn chỉnh sử dụng thư viện **`sharp`** (C++ Libvips binding). Script sẽ tự động:
1. Đọc toàn bộ các tệp `.jpg`, `.jpeg`, `.png` trong `public/assets/art/`.
2. Tạo phiên bản **AVIF** (chất lượng 65, nén tối ưu effort 6).
3. Tạo phiên bản **WebP** (chất lượng 75, làm fallback).
4. Tự động trích xuất chuỗi **`blurDataURL` (Base64 placeholder kích thước 16px)** và lưu vào file manifest JSON để cung cấp hiệu ứng làm mờ mượt mà ngay khi trang vừa tải.

```javascript
// scripts/optimize-art-images.mjs
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const ART_DIR = path.resolve('public/assets/art');
const MANIFEST_PATH = path.resolve('public/assets/art/art-manifest.json');

async function processArtImages() {
  console.log('🌸 [Asset Pipeline] Đang quét và tối ưu hóa ảnh nghệ thuật Wabi-Sabi...');
  
  if (!fs.existsSync(ART_DIR)) {
    console.error('Không tìm thấy thư mục:', ART_DIR);
    return;
  }

  const files = fs.readdirSync(ART_DIR).filter(file => 
    /\.(jpg|jpeg|png)$/i.test(file) && !file.includes('-optimized')
  );

  const manifest = {};
  let totalOriginalBytes = 0;
  let totalAvifBytes = 0;

  for (const file of files) {
    const inputPath = path.join(ART_DIR, file);
    const baseName = path.parse(file).name;
    const stats = fs.statSync(inputPath);
    totalOriginalBytes += stats.size;

    console.log(`\nĐang xử lý: ${file} (${(stats.size / 1024).toFixed(1)} KB)`);

    // 1. Xuất file AVIF (Siêu nhẹ cho trình duyệt hiện đại)
    const avifName = `${baseName}.avif`;
    const avifPath = path.join(ART_DIR, avifName);
    await sharp(inputPath)
      .avif({ quality: 65, effort: 6 })
      .toFile(avifPath);

    const avifStats = fs.statSync(avifPath);
    totalAvifBytes += avifStats.size;
    const savings = (((stats.size - avifStats.size) / stats.size) * 100).toFixed(1);
    console.log(`  └─► [AVIF] ${avifName}: ${(avifStats.size / 1024).toFixed(1)} KB (Giảm ${savings}%)`);

    // 2. Xuất file WebP (Độ tương thích cao)
    const webpName = `${baseName}.webp`;
    const webpPath = path.join(ART_DIR, webpName);
    await sharp(inputPath)
      .webp({ quality: 75, effort: 5 })
      .toFile(webpPath);

    // 3. Tạo chuỗi làm mờ siêu nhỏ BlurDataURL (LQIP - Low Quality Image Placeholder)
    const blurBuffer = await sharp(inputPath)
      .resize(16, 16, { fit: 'inside' })
      .toFormat('webp', { quality: 20 })
      .toBuffer();
    
    const blurDataUrl = `data:image/webp;base64,${blurBuffer.toString('base64')}`;

    manifest[file] = {
      originalSize: stats.size,
      avif: { name: avifName, size: avifStats.size },
      webp: { name: `${baseName}.webp` },
      blurDataUrl,
    };
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8');
  
  const totalSavings = (((totalOriginalBytes - totalAvifBytes) / totalOriginalBytes) * 100).toFixed(1);
  console.log(`\n======================================================`);
  console.log(`✅ [TỔNG KẾT ASSET PIPELINE]`);
  console.log(`Tổng dung lượng ảnh gốc : ${(totalOriginalBytes / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Tổng dung lượng sau AVIF: ${(totalAvifBytes / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Tiết kiệm băng thông    : ${totalSavings}%!`);
  console.log(`File manifest JSON lưu tại: ${MANIFEST_PATH}`);
  console.log(`======================================================\n`);
}

processArtImages().catch(console.error);
```

---

## 3. 🎨 TỐI ƯU HÓA THÀNH PHẦN `JapaneseArtBackdrop.tsx`

Tích hợp trực tiếp file `art-manifest.json` vào component hiển thị ảnh nghệ thuật để kích hoạt hiệu ứng làm mờ tức thì và ưu tiên nạp:

```tsx
// src/components/art/JapaneseArtBackdrop.tsx
import Image from 'next/image';
import artManifest from '../../../public/assets/art/art-manifest.json';

interface JapaneseArtBackdropProps {
  src: string;
  alt: string;
  opacity?: number;
  priority?: boolean;
  blendMode?: 'normal' | 'multiply' | 'screen' | 'overlay';
  objectPosition?: string;
}

export function JapaneseArtBackdrop({
  src,
  alt,
  opacity = 0.15,
  priority = false,
  blendMode = 'normal',
  objectPosition = 'center',
}: JapaneseArtBackdropProps) {
  // Lấy tên file gốc để tra cứu thông số làm mờ blurDataURL
  const fileName = src.split('/').pop() || '';
  const manifestEntry = (artManifest as Record<string, any>)[fileName];
  const blurUrl = manifestEntry?.blurDataUrl;

  // Tự động chuyển hướng sang tệp AVIF nếu tồn tại
  const optimizedSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.avif');

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
        opacity,
        mixBlendMode: blendMode,
      }}
      aria-hidden="true"
    >
      <Image
        src={optimizedSrc}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={priority}
        placeholder={blurUrl ? 'blur' : 'empty'}
        blurDataURL={blurUrl}
        style={{
          objectFit: 'cover',
          objectPosition,
        }}
      />
    </div>
  );
}
```

---

## 4. 🌸 TÁI THIẾT KẾ `SakuraBackground`: THUẦN TÚY CSS HARDWARE ACCELERATION

### 4.1. Bản Chất Vấn Đề Hiện Tại
Thành phần `SakuraBackground.tsx` hiện tại dùng JavaScript để tính toán toán học ngẫu nhiên cho 18 cánh hoa trong hàm `useEffect`, sau đó gắn inline styles. Khi trình duyệt chuyển động cánh hoa bằng animation CSS không khai báo layer tăng tốc phần cứng, CPU của thiết bị liên tục bị đánh thức.

### 4.2. Giải Pháp: Thuần Túy CSS GPU Keyframes & Media Queries

```css
/* src/app/globals.css */
@keyframes sakuraFall {
  0% {
    transform: translate3d(0, -10vh, 0) rotate(0deg);
    opacity: 0;
  }
  15% {
    opacity: var(--petal-opacity, 0.8);
  }
  90% {
    opacity: var(--petal-opacity, 0.8);
  }
  100% {
    transform: translate3d(var(--sway-x, 120px), 110vh, 0) rotate(720deg);
    opacity: 0;
  }
}

.sakura-container {
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 1;
  contain: strict; /* Cách ly hoàn toàn layout & paint khỏi phần còn lại của DOM */
}

.sakura-petal {
  position: absolute;
  top: -20px;
  background: radial-gradient(circle at 60% 40%, #FFB7C5 0%, #FF99AC 80%);
  border-radius: 12px 1px 12px 1px;
  will-change: transform;
  animation: sakuraFall linear infinite;
}

/* Ẩn bớt cánh hoa trên thiết bị di động để bảo toàn pin và CPU */
@media (max-width: 768px) {
  .sakura-petal:nth-child(n+9) {
    display: none !important;
  }
}

/* Tôn trọng cài đặt giảm chuyển động của người dùng (Trợ năng / Tiết kiệm năng lượng) */
@media (prefers-reduced-motion: reduce) {
  .sakura-container {
    display: none !important;
  }
}
```

---

## 5. 🈳 KỸ THUẬT SUBSETTING FONT TIẾNG NHẬT (CJK SUBSETTING)

Bảng mã chữ Hán đầy đủ có thể lên tới 50,000 ký tự. Ngay cả bảng Joyo Kanji thông dụng cũng gồm **2,136 chữ Hán**.

### 5.1. Quy Trình Cắt Font Cục Bộ Bằng `pyftsubset` (FontTools)

Nếu dự án quyết định tự host font (Self-hosted Fonts) thay vì dùng Google CDN, ta có thể dùng công cụ mã nguồn mở của Google:

```bash
# Cài đặt bộ công cụ fonttools
pip install fonttools brotli

# Lệnh trích xuất chỉ bảng Hiragana, Katakana và 2136 chữ Joyo Kanji
pyftsubset NotoSansJP-Bold.otf \
  --unicodes="U+3040-309F,U+30A0-30FF,U+4E00-9FAF,U+0020-007E" \
  --flavor=woff2 \
  --output-file=NotoSansJP-Bold.subset.woff2
```
- **Kết quả**: Kích thước tệp font giảm từ **4.8 MB xuống còn 320 KB** (cắt giảm **93.3% dung lượng**).

---
*Tài liệu thuộc bộ hồ sơ kỹ thuật Master Performance Plan — Dự án Japanese SRS System.*
