# 🔍 BÁO CÁO KHẢO SÁT TOÀN DIỆN: TẦNG DỮ LIỆU ĐA PHƯƠNG TIỆN & DỊCH VỤ GOOGLE DRIVE
> **Người thực hiện:** `explorer_survey_1` (teamwork_preview_explorer)  
> **Thời điểm khảo sát:** 2026-10-07T01:12:00Z  
> **Dự án:** `japanese-srs-system` (記憶道 · Japanese SRS System)  
> **Mục tiêu:** Khảo sát nguồn chân lý dữ liệu (Single Source of Truth), dịch vụ Google Drive, API routes, DB schema invariants và các khối xây dựng giao diện phục vụ trang Showcase `/demo/drive`.

---

## 1. TỔNG QUAN ĐIỀU HÀNH (EXECUTIVE SUMMARY)

1. **Kho tài nguyên đa phương tiện (Multimodal Assets):**
   - File manifest trung tâm `data/multimodal-manifest.json` chứa **456 tài nguyên** được đồng bộ và phân bổ trên **8 danh mục/miền kiến thức**.
   - Phân bố chi tiết:
     - `kanji`: **111** tệp (SVG hoạt họa nét viết chuẩn Stroke Order)
     - `vocab_audio`: **291** tệp (MP3 phát âm giọng bản xứ Tokyo & Tatoeba)
     - `illustration`: **31** tệp (bao gồm 26 ảnh PNG minh họa Irasutoya Master 1200px + 5 ảnh SVG từ vựng Minna)
     - `grammar_infographic`: **5** tệp (SVG sơ đồ tư duy ngữ pháp N5-N1)
     - `ielts_audio`: **9** tệp (MP3 phát âm chuẩn học thuật Oxford/Cambridge)
     - `immersion_clip`: **3** tệp (MP3 hội thoại song ngữ đời sống kèm metadata phụ đề)
     - `jlpt_choukai`: **2** tệp (MP3 đề thi nghe hiểu JLPT N5 chính thức kèm câu hỏi & script)
     - `pubmed_corpus`: **4** tệp (JSON tài liệu y sinh học & khoa học thần kinh nhận thức)
     - *Tổng cộng: 111 + 291 + 31 + 5 + 9 + 3 + 2 + 4 = 456 tài nguyên*.
     - *Lưu ý về số lượng:* Yêu cầu ban đầu nhắc đến "430+ assets across 8 categories" dựa trên ước lượng cơ sở (430 = 111 + 291 + 5 + 5 + 9 + 3 + 2 + 4, chưa cộng 26 ảnh PNG Irasutoya). Manifest thực tế hoàn chỉnh có 456 tài nguyên.

2. **Dịch vụ Google Drive & Kiến trúc URL CDN:**
   - Đã có sẵn dịch vụ nền tảng `GoogleDriveService` tại `src/services/google/drive.service.ts` quản lý tương tác Drive API v3 (OAuth2 / Service Account).
   - `DriveFolderManager` tại `scripts/crawlers/drive-folder-manager.ts` quản lý 8 thư mục con trên Google Drive root `1GbG5uuvH_nBLqjr5yjmdrPMnvrDPenb_`.
   - **Phát hiện thực nghiệm quan trọng về URL Google:**
     - URL CDN trực tiếp `https://lh3.googleusercontent.com/d/{fileId}` hoạt động **hoàn hảo (HTTP 200)** cho hình ảnh và vector đồ họa (Kanji SVG, Minna SVG, Irasutoya PNG).
     - Tuy nhiên, Google Photos / LightHouse CDN (`lh3`) trả về **HTTP 404** cho các tệp âm thanh (`audio/mpeg`).
     - Đối với âm thanh MP3, URL tải trực tiếp `https://drive.google.com/uc?export=download&id={fileId}` (chuyển hướng 303 sang `drive.usercontent.google.com/download?...`) phản hồi **HTTP 200, Content-Type: audio/mpeg** và phát trực tiếp mượt mà trên trình duyệt.

3. **Hiện trạng API Routes & Dịch vụ Media:**
   - Route `src/app/api/media/route.ts` và Service `src/services/multimodal/media.service.ts` **ĐÃ TỒN TẠI** và đã được bao phủ trong bộ kiểm thử `tests/multimodal-media.test.ts`.
   - Toàn bộ **33 API routes** hiện có trong `src/app/api/` phải được giữ nguyên vẹn (Zero App Regression).

4. **Bảo toàn Cơ sở dữ liệu Turso (Zero DB Regression):**
   - Kho đa phương tiện hoàn toàn độc lập với bảng dữ liệu quan hệ Turso LibSQL (`src/db/schema.ts`).
   - Tuyệt đối **không chỉnh sửa** `src/db/schema.ts` và không tạo migration mới.

5. **Hiện trạng Chất lượng Mã nguồn:**
   - **23/23 Vitest test suites (139/139 tests)** đang XANH 100%.
   - **`npx tsc --noEmit`** đạt 0 lỗi (0 errors, strict mode).

---

## 2. KHẢO SÁT CHI TIẾT TẬP TIN `data/multimodal-manifest.json`

### 2.1. Cấu trúc Root Schema
```typescript
interface MultimodalManifest {
  totalAssets: number;                  // 456
  lastUpdated: string;                  // ISO 8601 (ví dụ: "2026-10-07T00:54:25.346Z")
  categories: Record<string, number>;   // Thống kê số lượng theo danh mục
  assets: Record<string, AssetEntry>;   // Bảng băm danh mục tài nguyên theo key
}
```

### 2.2. Phân loại 8 Miền Kiến thức (Domains/Categories)

| STT | Tên danh mục trong code (`category`) | Số lượng tệp | Định dạng MIME | Thư mục tương ứng trên Google Drive | Ví dụ Asset Key |
|:---:|:---|:---:|:---|:---|:---|
| 1 | `kanji` | 111 | `image/svg+xml` | `01_Kanji_Stroke_Order_Animations` | `kanji:東`, `kanji:本` |
| 2 | `vocab_audio` | 291 | `audio/mpeg` | `02_Japanese_Native_Audio_Bank` | `vocab_audio:両親`, `vocab_audio:先生` |
| 3 | `illustration` | 31 | `image/svg+xml` (5), `image/png` (26) | `03_Minna_Visual_Illustrations` | `illustration:両親`, `illustration:irasutoya_学校_...` |
| 4 | `grammar_infographic` | 5 | `image/svg+xml` | `04_Grammar_Mindmaps_Infographics` | `grammar_infographic:G-72` |
| 5 | `ielts_audio` | 9 | `audio/mpeg` | `05_IELTS_Practice_Audio_Bank` | `ielts_audio:ubiquitous` |
| 6 | `immersion_clip` | 3 | `audio/mpeg` | `06_Anime_Immersion_Sentence_Clips` | `immersion_clip:こんにちは` |
| 7 | `jlpt_choukai` | 2 | `audio/mpeg` | `07_JLPT_Choukai_Exam_Archive` | `jlpt_choukai:jlpt_n5_mondai1_q1` |
| 8 | `pubmed_corpus` | 4 | `application/json` | `08_PubMed_JStage_Bilingual_Corpus` | `pubmed_corpus:42391239` |
| **Tổng** | **8 danh mục** | **456** | — | **Root Drive Folder** | — |

### 2.3. Cấu trúc Thuộc tính của từng Phần tử Tài nguyên (`AssetEntry`)
Mỗi tài nguyên trong `manifest.assets` tuân theo interface:
```typescript
interface AssetEntry {
  key: string;              // Khóa định danh độc nhất (VD: 'kanji:東', 'vocab_audio:両親')
  category: string;         // 1 trong 8 danh mục đã chuẩn hóa
  fileName: string;         // Tên tệp tin gốc lưu trên Google Drive
  mimeType: string;         // MIME format (image/svg+xml, audio/mpeg, image/png, application/json)
  fileId: string;           // Google Drive Unique File ID (VD: '1qhIG9aHIxeIAGs3OjHSQpWqS8bDQMsWI')
  driveUrl: string;         // Đường dẫn xem Drive: `https://drive.google.com/file/d/${fileId}/view?usp=drivesdk`
  cdnUrl: string;           // Đường dẫn trực tiếp CDN: `https://lh3.googleusercontent.com/d/${fileId}`
  sizeBytes: number;        // Kích thước tệp tin tính bằng byte
  updatedAt: string;        // Thời gian đồng bộ ISO 8601
  metadata?: Record<string, any>; // Siêu dữ liệu mở rộng theo nghiệp vụ từng danh mục
}
```

### 2.4. Khảo sát Siêu dữ liệu Nghiệp vụ Đặc thù (`metadata`)
Mỗi danh mục sở hữu các trường metadata phong phú phục vụ hiển thị chi tiết:
- **`immersion_clip`**:
  - `keyword`: Từ vựng khóa (VD: `"こんにちは"`)
  - `topic`: Chủ đề đời sống (VD: `"Chào hỏi hàng ngày (Daily Greetings)"`)
  - `level`: Trình độ JLPT (VD: `"N5"`)
  - `japanese`: Câu tiếng Nhật nguyên bản (kèm câu chào, thời tiết)
  - `translationVi` / `translationEn`: Bản dịch đối chiếu
  - `speaker`: Tên diễn viên lồng tiếng (VD: `"CVjpn1"`)
  - `tatoebaSentenceId`, `tatoebaAudioId`: ID định danh nguồn mở
  - `subtitlesSync`: Mảng đồng bộ phụ đề theo mốc thời gian `{ start, end, text, vi }`
- **`jlpt_choukai`**:
  - `level`: `"N5"`
  - `mondai`: Số phần thi (VD: `1`)
  - `mondaiName`: Tên phần thi (VD: `"課題理解 (Hiểu đề bài - Task Comprehension)"`)
  - `questionNumber`: Số thứ tự câu hỏi
  - `title`: Tựa đề bài nghe (VD: `"Câu hỏi về vật dụng cần mang theo (持ち物)"`)
  - `question`: Câu hỏi bằng tiếng Nhật
  - `options`: 4 phương án lựa chọn (mảng 4 chuỗi)
  - `correctOption`: Đáp án đúng (1..4)
  - `script`: Toàn văn lời thoại hội thoại giữa nam và nữ
  - `explanationVi`: Lời giải thích cặn kẽ bằng tiếng Việt
  - `officialSource`: Nguồn đề thi chính thức của Japan Foundation / JEES
- **`pubmed_corpus`**:
  - `pmid`: Mã định danh PubMed (VD: `"42391239"`)
  - `doi`: Mã DOI bài báo khoa học
  - `title`: Tựa đề nghiên cứu khoa học nhận thức thần kinh
  - `pubYear`: Năm xuất bản (VD: `"2026"`)
  - `topic`: Lĩnh vực nghiên cứu (VD: `"Japanese Language & Cognitive Neuroscience"`)
- **`ielts_audio`**:
  - `title`: Tựa đề bài luyện
  - `sectionNumber`: Phần thi IELTS (Section 1..4)
  - `sectionType`: Thể loại bài thi (Monologue, Dialogue...)
  - `transcript`: Lời chép âm học thuật
- **`illustration`**:
  - `title`, `resolution` (1200px), `artist` (Irasutoya), `sourceUrl`

---

## 3. KHẢO SÁT DỊCH VỤ GOOGLE DRIVE & KIẾN TRÚC URL

### 3.1. Dịch vụ Máy chủ: `GoogleDriveService` (`src/services/google/drive.service.ts`)
- **Cơ chế xác thực:** Tự động hỗ trợ 2 phương thức:
  1. `GOOGLE_REFRESH_TOKEN` + `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET`: Sử dụng tài khoản Google cá nhân.
  2. `credentials.json` hoặc `GOOGLE_SERVICE_ACCOUNT_JSON`: Service Account tự động hóa không cần người dùng can thiệp.
- **Phương thức chính:**
  - `GoogleDriveService.verifyConnection()`: Kiểm tra kết nối tới Google Drive API v3.
  - `GoogleDriveService.createFolder(folderName, parentFolderId?)`: Tạo thư mục trên Drive.
  - `GoogleDriveService.uploadFile(options)`: Đẩy tệp tin lên Drive và cấp quyền public reader.
  - `GoogleDriveService.listFiles(folderId?, pageSize?)`: Truy vấn danh sách tệp tin.
  - `GoogleDriveService.getDirectCdnUrl(fileId)`: Sinh link định dạng `https://lh3.googleusercontent.com/d/${fileId}`.
- **Ranh giới thực thi (Server-Side Invariant):**
  - Tệp `drive.service.ts` import thư viện `googleapis`, `fs`, `path`, `stream`.
  - **CẢNH BÁO KIẾN TRÚC:** Không được phép import `GoogleDriveService` trực tiếp vào các component React Client (`'use client'`), vì Webpack/Next.js client bundle sẽ báo lỗi thiếu các module native Node.js (`fs`, `stream`). Giao diện client phải gọi qua API Route hoặc dùng dữ liệu tĩnh từ manifest.

### 3.2. Quản lý Phân vùng Manifest: `DriveFolderManager` (`scripts/crawlers/drive-folder-manager.ts`)
- Quản lý 8 thư mục phân vùng độc lập trong `data/manifests/${category}.json`:
  - `kanji.json`, `vocab_audio.json`, `illustration.json`, `grammar_infographic.json`, `ielts_audio.json`, `immersion_clip.json`, `jlpt_choukai.json`, `pubmed_corpus.json`.
- Tự động gộp (aggregate) các phân vùng thành `data/multimodal-manifest.json` theo cơ chế ghi tệp nguyên tử (Atomic Write via temp file + rename).

### 3.3. Phân tích Thực nghiệm Hành vi URL CDN vs Streaming của Google Drive
Chúng tôi đã thực hiện lệnh gọi HTTP thực nghiệm trên các tài nguyên thực tế:
1. **Đối với tệp hình ảnh & vector (Kanji SVG, Minna SVG, Irasutoya PNG):**
   - URL: `https://lh3.googleusercontent.com/d/{fileId}`
   - Kết quả: **HTTP 200 OK**
   - `Content-Type: image/png` hoặc vector trực tiếp.
   - Trình duyệt hiển thị tức thì không bị chặn CORS.
2. **Đối với tệp âm thanh MP3 (`vocab_audio`, `ielts_audio`, `immersion_clip`, `jlpt_choukai`):**
   - URL `https://lh3.googleusercontent.com/d/{fileId}`: Trả về **HTTP 404** (do máy chủ LightHouse chỉ phục vụ định dạng ảnh).
   - URL `https://drive.google.com/uc?export=download&id={fileId}`: Trả về **HTTP 303 Redirect** sang `https://drive.usercontent.google.com/download?id={fileId}&export=download`.
   - Kết quả sau chuyển hướng: **HTTP 200 OK, Content-Type: audio/mpeg**, kích thước chuẩn, thẻ `<audio src="..." />` phát thanh mượt mà!
3. **Chiến lược URL kiến nghị cho Showcase:**
   - Tạo hàm tiện ích thuần túy (pure helper) tái sử dụng được ở cả client và server:
     ```typescript
     export function getMediaAssetUrl(asset: { fileId: string; mimeType?: string; category?: string; cdnUrl?: string }): string {
       const isAudio = asset.mimeType?.startsWith('audio/') || 
                       ['vocab_audio', 'ielts_audio', 'immersion_clip', 'jlpt_choukai'].includes(asset.category || '');
       if (isAudio) {
         return `https://drive.google.com/uc?export=download&id=${asset.fileId}`;
       }
       return asset.cdnUrl || `https://lh3.googleusercontent.com/d/${asset.fileId}`;
     }
     ```

---

## 4. KHẢO SÁT HỆ THỐNG API ROUTES & SERVICES ĐANG HOẠT ĐỘNG

### 4.1. Route `src/app/api/media/route.ts` & `MultimodalMediaService`
Hệ thống đã có sẵn route `GET /api/media` hỗ trợ các truy vấn:
- `?summary=true`: Trả về tổng quan số lượng tài nguyên và danh mục.
- `?category={category}&limit={limit}`: Lấy danh sách tài nguyên thuộc danh mục (mặc định limit=20).
- `?search={query}&category={category}&limit={limit}`: Tìm kiếm toàn văn theo query (so khớp trên `key`, `fileName`, `metadata.title`, `metadata.word`, `metadata.japanese`).
- `?kanji={kanji}`: Lấy nét vẽ động của Hán tự.
- `?word={word}`: Lấy URL âm thanh phát âm và hình minh họa.
- `?grammar={grammar}`: Lấy sơ đồ tư duy ngữ pháp.
- `?immersion={keyword}`: Lấy clip hội thoại ngữ cảnh.
- `?jlpt={questionId}`: Lấy bài thi nghe JLPT.
- `?ielts={word}`: Lấy âm thanh học thuật IELTS.
- `?pubmed={pmid}`: Lấy bản ghi y sinh học PubMed.

### 4.2. Danh mục 33 API Routes Hiện Hữu Cần Giữ Nguyên Vẹn (Zero Regression)
1. `/api/cards` (Drizzle/Turso LibSQL cards loader & deck summaries)
2. `/api/capture/process`
3. `/api/chat` (Sensei AI chatbot)
4. `/api/copilot/draft`
5. `/api/google/auth-redirect`, `/api/google/auth-url`, `/api/google/callback`, `/api/google/disconnect`, `/api/google/status`
6. `/api/google/calendar/sync`, `/api/google/sheets/export`, `/api/google/sheets/import`, `/api/google/tasks/sync`
7. `/api/grammar`, `/api/grammar/[lessonId]`, `/api/grammar/practice`
8. `/api/health`
9. `/api/ielts`, `/api/ielts/dashboard`, `/api/ielts/logs`, `/api/ielts/materials`, `/api/ielts/mistakes`, `/api/ielts/sessions`, `/api/ielts/sessions/[id]`, `/api/ielts/vocab`
10. `/api/media` (Cung cấp tài nguyên đa phương tiện)
11. `/api/nlp`
12. `/api/review`, `/api/review/batch`, `/api/review/evaluate`
13. `/api/scheduler/interleave`, `/api/scheduler/optimize`
14. `/api/telemetry`

---

## 5. BẢO TOÀN CƠ SỞ DỮ LIỆU TURSO & SCHEMA INVARIANTS

### 5.1. Phân tích `src/db/schema.ts`
- Schema cơ sở dữ liệu hiện tại gồm 15 bảng:
  - Lõi học tập: `decks`, `cards`, `reviewLogs`
  - Khoa học nhận thức: `userFsrsParameters`, `cardEmbeddings`, `retrievalLatencyLogs`, `kanjiGraphNodes`, `kanjiGraphEdges`, `cognitiveInteractionLogs`, `gamificationEffortLedger`
  - Ngữ pháp: `grammarLessons`, `grammarPatterns`, `grammarExercises`
  - IELTS: `engMaterials`, `ieltsSessions`, `ieltsPracticeLogs`, `ieltsMistakes`, `engVocab`
- **Kết luận:** Kho dữ liệu đa phương tiện Google Drive **hoàn toàn phi quan hệ (decoupled)**, được lưu trữ và lập chỉ mục trong manifest JSON và phục vụ qua Service Layer. **Không có bất kỳ lý do gì cần thay đổi `src/db/schema.ts`**. Điều răn 1 của `AGENTS.md` được đảm bảo tuyệt đối.

---

## 6. CÁC KHỐI XÂY DỰNG GIAO DIỆN & QUY TẮC MỸ HỌC WA-STYLE

### 6.1. Bảng màu Nippon Colors & Biến CSS trong `src/app/globals.css`
Giao diện Showcase `/demo/drive` cần kế thừa các token màu sắc chính thức:
- **Nền giấy Washi (Torinoko):** `var(--washi-base)` (`#F7F4EB`), `var(--washi-card)` (`#FAF8F2`), `var(--washi-border)` (`#DFD9CB`).
- **Mực mài thư pháp Sumi:** `var(--sumi-ink)` (`#1A1918`), `var(--sumi-body)` (`#47433E`), `var(--sumi-faint)` (`#878278`).
- **Đỏ son đền Torii (Bengara):** `var(--bengara-red)` (`#9E3223`), `var(--bengara-soft)` (`#FDF2F0`).
- **Lam chàm Samurai (Aizome):** `var(--aizome-navy)` (`#16253B`), `var(--aizome-soft)` (`#EDF2F7`), `var(--aizome-border)` (`#BDCCDC`).
- **Vàng kim Kintsugi (Kincha):** `var(--kincha-gold)` (`#AF7E36`), `var(--kincha-soft)` (`#FBF5E8`).
- **Xanh rêu thiền viện (Koke/Matcha):** `var(--koke-green)` (`#485642`), `var(--matcha-subtle)` (`#EFF4EE`).

### 6.2. Phông chữ Văn hóa
- Chữ Hán Kanji & Tiêu đề nghệ thuật: `var(--font-mincho)` (`Shippori Mincho`).
- Chữ mềm Kana & Giao diện hiện đại: `var(--font-maru)` (`Zen Maru Gothic`).
- Tiêu đề phương Tây: `var(--font-display)` (`Bebas Neue`).

### 6.3. Quy tắc App Router & Suspense Boundary (`SKILL.md`)
- Khi trang `/demo/drive` sử dụng hook `useSearchParams()` để lưu trạng thái danh mục hoặc từ khóa tìm kiếm trên URL (URL-First State Architecture), component con bắt buộc phải được bao bọc trong:
  ```tsx
  <Suspense fallback={<WashiSkeleton />}>
    <DriveShowcaseInner />
  </Suspense>
  ```
- Điều này ngăn chặn việc Next.js de-opt SSR/SSG thành Client-Side Only lúc build.

---

## 7. ĐÁNH GIÁ VÀ KHUYẾN NGHỊ CHO KIẾN TRÚC SƯ & FRONTEND DEVELOPER

1. **Về việc tải dữ liệu cho Showcase:**
   - Không nên gọi từng asset lẻ tẻ. Khuyến nghị mở rộng nhẹ hàm `MultimodalMediaService.getAllAssets()` hoặc `MultimodalMediaService.getManifest()` trong `src/services/multimodal/media.service.ts` để API `/api/media?all=true` hoặc Server Component tại `src/app/demo/drive/page.tsx` có thể nạp toàn bộ 456 tài nguyên ngay tại Server/SSR, sau đó chuyển giao cho Client Component xử lý lọc/tìm kiếm trong bộ nhớ (<50ms phản hồi).
2. **Về trình phát âm thanh (Audio Player):**
   - Đảm bảo thẻ `<audio src="...">` hoặc Web Audio API sử dụng URL `https://drive.google.com/uc?export=download&id=${fileId}` thay vì link `lh3` để tránh lỗi 404.
   - Thêm bộ hiển thị thanh sóng (waveform indicator) và thời gian phản xạ (latency feedback) theo yêu cầu R2.
3. **Về trình diễn Kanji SVG:**
   - Link `https://lh3.googleusercontent.com/d/${fileId}` hoạt động tốt cho thẻ `<img src="...">` hoặc có thể nhúng trực tiếp SVG để tạo hiệu ứng viết nét động (stroke-dasharray animation).
4. **Về Lightbox Modal:**
   - Áp dụng cho các ảnh Irasutoya Master PNG 1200px và Infographics Ngữ pháp với tính năng phóng to (zoom) và hiển thị bảng thông tin siêu dữ liệu (metadata card).

---
*Báo cáo được hoàn thành và xác thực độc lập bởi `explorer_survey_1`.*
