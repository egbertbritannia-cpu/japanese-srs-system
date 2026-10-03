# 05 — TẦNG 5: Tối Ưu Hoá Mạng, CDN Vercel & Phân Phối Biên (Edge Caching)

> **Định vị tài liệu**: Tầng 5 (Network Infrastructure & Edge CDN Layer) — Thiết kế kiến trúc truyền dẫn mạng máy tính và phân phối nội dung tĩnh/động cho dự án `japanese-srs-system`. Trọng tâm: định tuyến Edge Point of Presence (PoP) tối ưu cho người dùng Việt Nam (`sin1` Singapore), thiết lập ma trận tiêu đề HTTP `Cache-Control` chuẩn W3C, khai thác giao thức thế hệ mới HTTP/3 QUIC, cấu hình Resource Hints và phương án chống chịu các đợt đứt cáp quang biển quốc tế.

---

## 1. 🌐 ĐỊNH TUYẾN MẠNG PHÂN PHỐI BIÊN VERCEL CHO NGƯỜI DÙNG VIỆT NAM

Vercel Edge Network vận hành dựa trên hệ thống mạng Anycast định tuyến thông minh. Đối với người dùng truy cập từ Việt Nam (Hà Nội, TP.HCM, Đà Nẵng, Cần Thơ):

```
+─────────────────────────────────────────────────────────────────────────────+
|               LUỒNG ĐỊNH TUYẾN MẠNG VẬT LÝ TỪ VIỆT NAM                      |
+─────────────────────────────────────────────────────────────────────────────+
| [Thiết Bị Người Dùng Tại Việt Nam] (Mạng Viettel, VNPT, FPT)                |
|         │                                                                   |
|         │ (Độ trễ cáp quang ngầm biển: 32ms - 42ms)                         |
|         ▼                                                                   |
| [Vercel Edge PoP: Singapore (sin1)] ◄─── BỘ NHỚ ĐỆM BIÊN (EDGE CACHE HIT!)   |
|         │                                - Trả về ảnh Ukiyo-e trong 35ms     |
|         │                                - Trả về Font chữ Woff2 trong 35ms  |
|         │                                - Trả về JS/CSS Chunks trong 35ms   |
|         │                                                                   |
|         │ (CHỈ KHI CACHE MISS HOẶC DỮ LIỆU ĐỘNG CHƯA ĐỆM)                    |
|         │ (Truyền qua Mạng trục Backbone cáp ngầm Vercel: 180ms)             |
|         ▼                                                                   |
| [Vercel Serverless Function: US-East Virginia (iad1)]                       |
|         │                                                                   |
|         │ (Truy vấn cơ sở dữ liệu qua giao thức libSQL HTTP: 35ms)          |
|         ▼                                                                   |
| [Turso Database Cloud: Singapore Read Replica (sin)]                        |
+─────────────────────────────────────────────────────────────────────────────+
```

### 1.1. Nguyên Lý Tối Thượng Về Hiệu Năng
Toàn bộ tài nguyên tĩnh (Static Assets: 26 bức ảnh mỹ thuật Nhật Bản, tệp Font CJK, các gói JavaScript chunks, mã CSS) và dữ liệu bán tĩnh (Danh mục bộ thẻ, danh sách bài học) **phải được giữ lại và phục vụ trực tiếp tại Edge PoP Singapore (`sin1`)**. Không một yêu cầu tài nguyên tĩnh nào được phép chạm vào serverless function ở Mỹ.

---

## 2. 🛡️ MA TRẬN TIÊU ĐỀ HTTP `Cache-Control` TOÀN DIỆN

Để loại bỏ các truy vấn điều kiện thừa thãi (mã HTTP 304), hệ thống phải áp dụng chính sách bộ đệm bất biến (Immutable Caching) kết hợp với cơ chế tái xác thực ngầm (`stale-while-revalidate`):

```
+──────────────────────────────────────────────────────────────────────────────────────────────────+
|                              MA TRẬN TIÊU ĐỀ HTTP CACHE-CONTROL                                  |
+──────────────────────┬───────────────────────────────────────────┬──────────────┬────────────────+
| Phân loại tài nguyên | Giá trị tiêu đề Cache-Control             | Vị trí đệm   | Thời hạn sống  |
+──────────────────────┼───────────────────────────────────────────┼──────────────┼────────────────+
| Next.js Static Chunks| public, max-age=31536000, immutable       | Browser & CDN| 1 Năm (Vĩnh    |
| (/_next/static/*)    |                                           |              | viễn tuyệt đối)|
+──────────────────────┼───────────────────────────────────────────┼──────────────┼────────────────+
| Ảnh nghệ thuật Ukiyo | public, max-age=31536000, immutable       | Browser & CDN| 1 Năm          |
| (/assets/art/*)      |                                           |              |                |
+──────────────────────┼───────────────────────────────────────────┼──────────────┼────────────────+
| Google Fonts         | public, max-age=31536000, immutable       | Browser & CDN| 1 Năm          |
| (fonts.gstatic.com)  |                                           |              |                |
+──────────────────────┼───────────────────────────────────────────┼──────────────┼────────────────+
| API Danh sách thẻ    | public, s-maxage=60,                      | Edge CDN     | 60 giây tươi,  |
| (/api/cards)         | stale-while-revalidate=300                |              | dùng cũ thêm 5p|
+──────────────────────┼───────────────────────────────────────────┼──────────────┼────────────────+
| Trang Dashboard HTML | public, s-maxage=0, must-revalidate       | Browser      | Luôn kiểm tra  |
| (SSR Dynamic)        |                                           |              | độ tươi mới    |
+──────────────────────┴───────────────────────────────────────────┴──────────────┴────────────────+
```

### 2.1. Giải Mã Cơ Chế Vận Hành `stale-while-revalidate`

```
Yêu cầu 1 [Giây thứ 10] ──► Cache HIT tại Edge (Tuổi dữ liệu: 10s < 60s) ──► Phản hồi ngay (35ms)
Yêu cầu 2 [Giây thứ 80] ──► Dữ liệu đã CŨ (80s > 60s nhưng < 360s)
                             │
                             ├─► PHẢN HỒI NGAY LẬP TỨC DỮ LIỆU CŨ CHO USER (35ms - KHÔNG PHẢI CHỜ!)
                             │
                             └─► Edge CDN âm thầm gửi request ngầm về Serverless làm mới cache!
```

---

## 3. 🔍 ĐỌC VÀ CHẨN ĐOÁN TIÊU ĐỀ `x-vercel-cache`

Khi kiểm tra một request trong tab Network của Chrome DevTools:
- **`x-vercel-cache: HIT`**: Dữ liệu được đọc trực tiếp từ bộ nhớ RAM của Edge PoP Singapore. Thời gian phản hồi: **< 40ms**.
- **`x-vercel-cache: MISS`**: Dữ liệu chưa tồn tại trong cache của PoP đó. Yêu cầu được chuyển tiếp về origin server tại Mỹ. Thời gian phản hồi: **300ms - 600ms**.
- **`x-vercel-cache: STALE`**: CDN vừa trả về bản sao cũ và đang làm mới dữ liệu ở chế độ chạy ngầm.
- **`x-vercel-cache: REVALIDATED`**: Dữ liệu vừa được cập nhật mới thành công sau một lệnh làm mới.

---

## 4. 🚀 KÍCH HOẠT HTTP/3 (QUIC) & THUẬT TOÁN BBR CONGESTION CONTROL

Vercel tự động hỗ trợ giao thức **HTTP/3 trên nền tảng UDP** kết hợp thuật toán kiểm soát tắc nghẽn **BBR (Bottleneck Bandwidth and RTT)** của Google.

```
KHI HỌC TIẾNG NHẬT TRÊN MẠNG DI ĐỘNG 4G VIỆT NAM (SÓNG CHẬP CHỜN):

[HTTP/2 trên nền TCP]: 
  Packet 4 bị mất ──► KẸT CỨNG TOÀN BỘ KẾT NỐI (TCP Head-of-Line Blocking)
                     Chờ truyền lại mất 250ms ──► Ứng dụng bị đơ!

[HTTP/3 trên nền UDP (QUIC)]: 
  Packet 4 bị mất ──► CHỈ RIÊNG FILE ẢNH BỊ CHẬM
                     File CSS và mã JavaScript vẫn tiếp tục chạy bình thường!
                     Người dùng vẫn lật thẻ học từ vựng mượt mà!
```

### Ưu Thế Vượt Trội Của Connection Migration:
Khi người dùng chuyển mạng từ Wi-Fi nhà sang mạng di động 4G Viettel trên đường đi làm:
- Trong HTTP/1.1 và HTTP/2: Địa chỉ IP thay đổi, kết nối TCP bị đứt hoàn toàn, ứng dụng báo lỗi "Mất kết nối".
- Trong HTTP/3 (QUIC): Phiên kết nối được nhận diện bằng **Connection ID (64-bit CID)** độc lập với IP. Phiên học tập được duy trì liên tục mà **không bị gián đoạn dù chỉ 1 mili-giây**!

---

## 5. 🎯 CẤU HÌNH TOÀN DIỆN RESOURCE HINTS TRONG `src/app/layout.tsx`

```tsx
// src/app/layout.tsx (Phần chèn vào thẻ <head>)
<head>
  {/* 1. Mở sẵn kết nối TCP & TLS đến máy chủ Google Fonts (Tiết kiệm ~150ms) */}
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
  <link rel="dns-prefetch" href="https://fonts.googleapis.com" />

  {/* 2. Nạp trước bức ảnh Hero trọng tâm trên Dashboard với độ ưu tiên cao nhất */}
  <link
    rel="preload"
    as="image"
    href="/assets/art/golden-waves-kin-nami.avif"
    type="image/avif"
    fetchPriority="high"
  />
</head>
```

---

## 6. 🌊 KỊCH BẢN CHỐNG CHỊU SỰ CỐ ĐỨT CÁP QUANG BIỂN QUỐC TẾ (AAG, APG, IA)

Mỗi năm các tuyến cáp quang biển nối từ Việt Nam đi quốc tế gặp sự cố trung bình từ 3 đến 5 lần. Kế hoạch phòng hộ 3 lớp:

1. **Lớp 1 (Edge PoP Singapore `sin1`)**: Tuyến cáp ngầm từ TP.HCM/Vũng Tàu sang Singapore thường được ưu tiên băng thông cứu nạn. Nhờ lưu cache 1 năm toàn bộ ảnh và static assets tại Singapore, người dùng vẫn tải trang cực nhanh.
2. **Lớp 2 (Client Service Worker Cache)**: Toàn bộ âm thanh phát âm từ vựng, font chữ và các thẻ bài phổ biến được lưu trực tiếp trong bộ nhớ đĩa của trình duyệt.
3. **Lớp 3 (Offline-First Sync)**: Khi đường truyền quốc tế tê liệt hoàn toàn, người dùng vẫn tiếp tục ôn bài bình thường, dữ liệu được ghi vào IndexedDB và tự động đồng bộ khi mạng phục hồi.

---
*Tài liệu thuộc bộ hồ sơ kỹ thuật Master Performance Plan — Dự án Japanese SRS System.*
