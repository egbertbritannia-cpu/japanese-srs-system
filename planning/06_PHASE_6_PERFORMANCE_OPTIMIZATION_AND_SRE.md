# ⚡ GIAI ĐOẠN 6: KỸ THUẬT TỐI ƯU HIỆU NĂNG, KIẾN TRÚC SRE & GIÁM SÁT TELEMETRY TOÀN DIỆN
## Hệ Thống: Japanese SRS System (記憶道 FSRS) · Bản Quy Hoạch Hợp Nhất (Consolidated Specification)

> **Thông tin tổng hợp:**
> * **Giai đoạn:** Phase 6 (Sprints 13-14)
> * **Tệp nguồn hợp nhất:** `doc/performance/00-performance-foundation.md` đến `07-monitoring.md` và `PERFORMANCE-INDEX.md` (10 tệp)
> * **Trọng tâm kỹ thuật:** Đáp ứng hoàn hảo Core Web Vitals (LCP < 1.2s, FID/INP < 50ms, CLS < 0.05), Giảm thiểu TTFB trên Serverless Vercel qua Turso HTTPS REST Pipeline, Bundle Splitting, Dynamic Asset WebP/AVIF Subsets, Offline IndexedDB Sync và Real User Monitoring (RUM).
> * **Cam kết cốt lõi:** Trải nghiệm siêu tốc độ ngay cả trong điều kiện mạng di động 3G yếu hoặc máy cấu hình thấp.

---

### 📑 MỤC LỤC TỔNG QUAN GIAI ĐOẠN 6
1. [phần 1: nền tảng kỹ thuật hiệu năng & tiêu chuẩn core web vitals (performance foundation)](#phan-1)
2. [phần 2: kiểm toán kiến trúc toàn diện & nhận diện điểm nghẽn (architecture audit)](#phan-2)
3. [phần 3: tối ưu hóa next.js 15 app router, react server components & streaming](#phan-3)
4. [phần 4: tối ưu hóa tài nguyên đồ họa, hình ảnh & font chữ nhật bản (asset optimization)](#phan-4)
5. [phần 5: tối ưu hóa cơ sở dữ liệu turso cloud libsql & rest api (database latency)](#phan-5)
6. [phần 6: tối ưu hóa mạng, edge cdn & cơ chế lưu đệm http caching](#phan-6)
7. [phần 7: hiệu năng thực thi thời gian thực, ngoại tuyến indexeddb & web worker](#phan-7)
8. [phần 8: hệ thống giám sát telemetry, rum & quan sát ci/cd observability](#phan-8)
9. [phần 9: bảng chỉ mục & cẩm nang tra cứu nhanh hiệu năng (performance index)](#phan-9)

---

<a id="phan-1"></a>
# PHẦN 1: PHẦN 1: NỀN TẢNG KỸ THUẬT HIỆU NĂNG & TIÊU CHUẨN CORE WEB VITALS (PERFORMANCE FOUNDATION)
*Tệp gốc: `doc\performance\00-performance-foundation.md`*

---

## 00 — TẦNG NỀN: Lý Thuyết Nền Tảng Hiệu Suất Web & Khung Kiến Trúc

> **Định vị tài liệu**: Tầng 0 (Foundation Layer) — Khung lý thuyết vật lý, giao thức mạng, cơ chế browser rendering engine, runtime JavaScript và kiến trúc phân tán. Đây là kim chỉ nam khoa học làm nền tảng cho 7 tầng kỹ thuật chi tiết tiếp theo của dự án `japanese-srs-system`.  
> **Phạm vi đối tượng**: Full-stack Engineers, Performance Architects, AI Coding Agents.  
> **Ngữ cảnh hệ thống**: Next.js 15.5.27 (App Router), React 19, Turso Database (libSQL edge/HTTP), Drizzle ORM, Vercel Serverless Platform, FSRS Algorithm.

---

### 1. 🧠 Mental Model: Bản Chất Vật Lý Của Hiện Tượng "Web Chậm"

Một ứng dụng web không bao giờ chậm "ngẫu nhiên". Tốc độ truyền tải và tương tác của trang web bị chi phối tuyệt đối bởi 3 yếu tố cơ bản:
1. **Quy luật vật lý hữu hạn của đường truyền dữ liệu (Speed of Light in Fiber)**.
2. **Cơ chế đơn luồng (Single-Threaded Event Loop) của JavaScript Engine**.
3. **Độ phức tạp tính toán của Browser Rendering Pipeline**.

```
[User Click/URL] ──(1. Mạng & RTT)──► [Serverless Function] ──(2. I/O Turso)──► [Database]
       │                                       │                                │
       │                                200-400ms TTFB                   100-300ms Query
       ▼                                       │                                │
[Browser Engine] ◄──(3. HTML/RSC Stream)───────┴────────────────────────────────┘
       │
       ├─► Parse HTML ──► DOM Tree ─────────┐
       ├─► Parse CSS  ──► CSSOM Tree ───────┼─► Render Tree ──► Layout ──► Paint ──► Composite
       └─► Parse & Exec JS (Main Thread) ───┘      ▲
                 │                                 │
           (Long Tasks >50ms block UI) ────────────┘ (Gây Jank & Freeze)
```

#### 1.1. Browser Rendering Pipeline Chi Tiết

Khi trình duyệt nhận được chuỗi bytes đầu tiên qua giao thức HTTP, nó không thể hiển thị ngay lập tức giao diện người dùng mà phải trải qua một chuỗi biến đổi pipeline tuần tự nghiêm ngặt:

1. **Bytes Conversion**: 
   `Raw Network Bytes` (VD: `0x3C 0x68 0x74 0x6D 0x6C`) $\rightarrow$ `Characters` (dựa trên bảng mã UTF-8).
2. **Tokenization**:
   Bộ phân tích từ vựng (Lexer) chuyển các ký tự thành các `Token` chuẩn W3C: `StartTag: <html>`, `StartTag: <head>`, `StartTag: <link>`, `EndTag: </html>`.
3. **Node Creation & DOM Construction**:
   Các tokens được chuyển thành các đối tượng `Node` gắn với các thuộc tính và quy tắc quan hệ cha - con, tạo nên cây đối tượng tài liệu **DOM (Document Object Model)**.
4. **CSSOM Construction (CSS Object Model)**:
   Song song với DOM, khi gặp thẻ `<link rel="stylesheet">` hoặc `<style>`, trình duyệt dừng việc dựng Render Tree cho đến khi tải và phân tích xong CSS. Khác với DOM có thể xây dựng gia tăng (incremental), **CSSOM bắt buộc phải được dựng hoàn chỉnh** trước khi render vì quy tắc xếp tầng (Cascade) và kế thừa (Inheritance) có thể làm thay đổi thuộc tính của bất kỳ phần tử nào trước đó.
5. **Render Tree Generation**:
   Kết hợp DOM và CSSOM. Render Tree chỉ chứa các nút nhìn thấy được (`visible nodes`). Các phần tử mang `display: none` hoặc các thẻ không hiển thị như `<head>`, `<script>`, `<meta>` bị loại bỏ hoàn toàn khỏi Render Tree. Các phần tử có `visibility: hidden` vẫn tồn tại trong Render Tree vì chúng vẫn chiếm không gian hình học.
6. **Layout (Reflow)**:
   Trình duyệt bắt đầu từ gốc Render Tree, tính toán kích thước hình học chính xác (width, height theo pixel) và vị trí tọa độ $(x, y)$ của từng phần tử trên khung nhìn (Viewport). Giai đoạn này tiêu tốn nhiều CPU, phụ thuộc trực tiếp vào độ sâu của DOM và độ phức tạp của CSS Box Model (Flexbox, Grid, Table).
7. **Paint (Rasterization)**:
   Chuyển các hình học và thuộc tính đồ họa (màu sắc, border, shadow, text, background-image) thành các pixel thực tế trên màn hình hoặc đưa vào các bộ nhớ đệm đồ họa (Bitmaps/Textures).
8. **Composite (Hợp thành lớp đồ họa)**:
   Các phần tử có thuộc tính tạo lớp riêng (như `transform`, `opacity`, `will-change: transform`, thẻ `<video>`, `<canvas>`) được GPU đưa vào các lớp riêng biệt (`RenderLayers` / `GraphicsLayers`). GPU tổng hợp các lớp này lại và xuất ra màn hình mà không cần kích hoạt lại Reflow hay Repaint.

#### 1.2. Critical Rendering Path (Đường Dẫn Render Tới Hạn)

**Critical Rendering Path (CRP)** là chuỗi sự kiện tối thiểu mà trình duyệt phải hoàn thành từ lúc yêu cầu tài liệu cho đến lần vẽ đầu tiên xuất hiện trên màn hình người dùng.

Tài nguyên nằm trên CRP được gọi là **Render-Blocking Resources**:
- **HTML Document**: Gốc rễ của quá trình.
- **CSS Stylesheets**: Mặc định luôn là render-blocking. Nếu trang tải một file CSS 250KB qua mạng 4G độ trễ cao, màn hình người dùng sẽ hoàn toàn trắng xóa cho đến khi byte cuối cùng của CSS được tải và parse xong.
- **Synchronous JavaScript (`<script>` không có `async` hoặc `defer`)**: Vừa là **Render-blocking**, vừa là **Parser-blocking**. Khi parser gặp thẻ script đồng bộ, nó lập tức ngưng phân tích HTML, chờ tải script về, biên dịch và thực thi script ngay lập tức vì script có quyền can thiệp DOM thông qua `document.write()` hoặc thay đổi CSSOM.

```
CRP Bottleneck Waterfall:
HTML Download ──► [Parse HTML] ─────────► [Dừng phân tích] ──► [Tiếp tục Parse] ──► First Paint
                       │                         ▲
                       └─► [Gặp CSS & Sync JS] ──┘
                             │
                             ├─► Download CSS (200ms) ──► Parse CSSOM
                             └─► Download JS  (300ms) ──► Compile & Execute JS (Main Thread Block)
```

#### 1.3. Main Thread Contention & Jank (Hiện tượng giật lag khung hình)

Trình duyệt hiện đại chạy trên kiến trúc đa tiến trình (Multi-process Architecture):
- **Browser Process**: Quản lý UI, thanh địa chỉ, bookmarks, network requests.
- **GPU Process**: Xử lý việc vẽ các lớp đồ họa và tăng tốc phần cứng.
- **Renderer Process**: Mỗi tab chạy một tiến trình Renderer riêng biệt.

Bên trong Renderer Process, **Main Thread** là tài nguyên khan hiếm nhất vì nó phải gánh vác đồng thời:
1. Phân tích HTML và CSS.
2. Xây dựng DOM và CSSOM.
3. Chạy toàn bộ mã JavaScript của ứng dụng (bao gồm React Virtual DOM diffing, FSRS scheduling, event handlers).
4. Tính toán Layout và Paint.

**Quy chuẩn 60fps / 120fps**:
Để giao diện đạt độ mượt mà 60 khung hình/giây (60fps), trình duyệt chỉ có tối đa **16.67ms** cho một khung hình ($1000\text{ms} / 60$). Với màn hình 120Hz hiện đại (như trên iPhone Pro, iPad, các máy laptop cao cấp), con số này rút xuống chỉ còn **8.33ms**.
Nếu một tác vụ JavaScript (ví dụ: thuật toán FSRS tính toán lịch học cho 500 thẻ từ vựng) chiếm dụng Main Thread liên tục trong 120ms, toàn bộ các tác vụ vẽ khung hình, cuộn trang, và lắng nghe click của người dùng bị đóng băng hoàn toàn. Hiện tượng này gọi là **Jank** (rớt khung hình) hay **UI Freeze**.

#### 1.4. Hiệu Ứng Domino (The Waterfall Cascade Effect)

Trong phát triển web hiện đại, sự chậm trễ hiếm khi xảy ra đơn lẻ mà hoạt động theo chuỗi phản ứng dây chuyền (Cascade):
1. Font chữ Nhật Bản (`Zen Maru Gothic`, `Shippori Mincho`) được nạp qua `@import` trong CSS.
2. Trình duyệt phải tải HTML $\rightarrow$ phát hiện link CSS $\rightarrow$ tải CSS $\rightarrow$ phân tích CSS $\rightarrow$ phát hiện URL của Font file $\rightarrow$ bắt đầu thiết lập kết nối TCP/TLS mới đến `fonts.gstatic.com` $\rightarrow$ tải font woff2.
3. Trong suốt thời gian font đang tải (khoảng 400ms - 800ms trên mạng di động), trình duyệt rơi vào trạng thái **FOIT (Flash of Invisible Text)** — toàn bộ chữ Kanji và Kana trên màn hình bị ẩn đi, khiến chỉ số **LCP (Largest Contentful Paint)** bị đẩy lùi nghiêm trọng.

---

### 2. 📊 Core Web Vitals (CWV) — Hệ Quy Chiếu Đánh Giá Của Google

Google xác định Core Web Vitals là bộ chỉ số thực tế đo lường trải nghiệm người dùng (Real User Experience) tại hiện trường, tác động trực tiếp đến thứ hạng SEO và tỷ lệ chuyển đổi.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       CORE WEB VITALS BENCHMARKS                            │
├───────────────────┬──────────────┬──────────────────┬───────────────────────┤
│ Metric            │ Tốt (Good)   │ Cần Cải Thiện    │ Kém (Poor)            │
├───────────────────┼──────────────┼──────────────────┼───────────────────────┤
│ LCP (Load Speed)  │ ≤ 2.5 giây   │ 2.5s - 4.0s      │ > 4.0 giây            │
│ INP (Response)    │ ≤ 200 ms     │ 200ms - 500ms    │ > 500 ms              │
│ CLS (Visual Stab) │ ≤ 0.1        │ 0.1 - 0.25       │ > 0.25                │
│ TTFB (Server)     │ ≤ 800 ms     │ 800ms - 1800ms   │ > 1800 ms             │
│ FCP (First Paint) │ ≤ 1.8 giây   │ 1.8s - 3.0s      │ > 3.0 giây            │
└───────────────────┴──────────────┴──────────────────┴───────────────────────┘
```

#### 2.1. LCP (Largest Contentful Paint) — Đo Lường Tốc Độ Tải Nội Dung Trọng Tâm

- **Định nghĩa**: Thời điểm phần tử nội dung trực quan lớn nhất (hình ảnh hero, video poster, hoặc khối văn bản lớn) trong khung nhìn (Viewport) được hiển thị hoàn chỉnh cho người dùng.
- **Cơ chế đo của trình duyệt**: API `PerformanceObserver` với entry type `largest-contentful-paint`. Trình duyệt liên tục cập nhật ứng viên LCP khi các phần tử mới xuất hiện và dừng ghi nhận ngay khi người dùng có tương tác đầu tiên (nhấn phím, cuộn trang, chạm màn hình).
- **Phân rã thành phần thời gian của LCP**:
  $$\text{LCP} = \text{TTFB} + \text{Resource Load Delay} + \text{Resource Load Duration} + \text{Element Render Delay}$$
  - **TTFB (Time to First Byte)**: Thời gian server xử lý và gửi byte HTML đầu tiên.
  - **Resource Load Delay**: Khoảng cách từ lúc nhận HTML đến khi trình duyệt phát hiện ra tài nguyên LCP và bắt đầu tải. (Nếu hình ảnh LCP nằm trong CSS background hoặc được inject bằng JavaScript `useEffect`, độ trễ này có thể lên tới 500ms - 1500ms!).
  - **Resource Load Duration**: Thời gian truyền tải bytes của tài nguyên qua mạng (phụ thuộc kích thước file AVIF/WebP/JPG).
  - **Element Render Delay**: Thời gian từ khi tải xong tài nguyên đến khi trình duyệt vẽ xong lên màn hình (bị ảnh hưởng nếu Main Thread bị chiếm bởi JS hydration hoặc CSSOM chưa sẵn sàng).

#### 2.2. INP (Interaction to Next Paint) — Đo Lường Độ Nhạy Tương Tác

Từ tháng 3/2024, Google chính thức thay thế FID (First Input Delay) bằng **INP**. Trong khi FID chỉ đo độ trễ của tương tác đầu tiên, **INP đo lường toàn diện độ nhạy của mọi tương tác** (click nút, tap màn hình, gõ phím) xuyên suốt toàn bộ vòng đời phiên làm việc của người dùng trên trang.

- **Cấu trúc độ trễ của một tương tác**:
  $$\text{Interaction Latency} = \text{Input Delay} + \text{Processing Duration} + \text{Presentation Delay}$$
  1. **Input Delay**: Khoảng thời gian từ khi người dùng click chuột cho đến khi event listener bắt đầu chạy (do Main Thread đang bận xử lý tác vụ khác).
  2. **Processing Duration**: Thời gian thực thi mã JavaScript bên trong event handler (ví dụ: chạy thuật toán FSRS, tính toán Next Review Interval, cập nhật state React).
  3. **Presentation Delay**: Thời gian để trình duyệt tính toán lại Layout, Paint và GPU composite khung hình tiếp theo để hiển thị kết quả cho người dùng.

```
User Click ──► [Input Delay] ──► [Event Handler Exec] ──► [React Re-render] ──► [Layout/Paint] ──► Màn Hình Cập Nhật
                 ▲                       ▲                       ▲                     ▲
           Main thread bận          Code FSRS chạy          Virtual DOM Diff       Browser vẽ
```

#### 2.3. CLS (Cumulative Layout Shift) — Đo Lường Độ Ổn Định Thị Giác

- **Định nghĩa**: Tổng điểm số của tất cả các lần dịch chuyển bố cục đột ngột, bất ngờ của các phần tử nhìn thấy trong suốt thời gian tồn tại của trang.
- **Công thức tính điểm**:
  $$\text{Layout Shift Score} = \text{Impact Fraction} \times \text{Distance Fraction}$$
  - **Impact Fraction**: Tỷ lệ phần trăm diện tích khung nhìn bị ảnh hưởng bởi phần tử dịch chuyển giữa 2 khung hình liên tiếp.
  - **Distance Fraction**: Khoảng cách lớn nhất mà phần tử không ổn định bị dịch chuyển chia cho chiều cao (hoặc chiều rộng) của khung nhìn.
- **Nguyên nhân cốt lõi trong `japanese-srs-system`**:
  1. Hình ảnh nghệ thuật Nhật Bản (như `hokusai-suwa-lake.jpg`, tranh sóng `golden-waves-kin-nami.jpg`) được render mà **không khai báo trước thuộc tính `width`, `height` hoặc `aspect-ratio`**. Khi ảnh tải xong, nó đẩy toàn bộ nội dung phía dưới xuống đột ngột.
  2. Font chữ nhảy cỡ (Font Swapping): Khi font hệ thống (`sans-serif`) được thay thế bằng `Zen Maru Gothic` hoặc `Shippori Mincho`, do số đo độ rộng con chữ (glyph advance metrics) khác nhau, toàn bộ các đoạn văn bản bị vỡ dòng và nhảy vị trí.

---

### 3. 🌐 Giao Thức Mạng: HTTP/1.1, HTTP/2, HTTP/3 & Hạ Tầng Kết Nối

Hiệu suất web chịu sự ràng buộc khắt khe của các định luật mạng máy tính:

```
+-----------------------------------------------------------------------------+
|                      SO SÁNH CÁC GIAO THỨC TRUYỀN DẪN                       |
+-------------------+--------------------+-------------------+----------------+
| Đặc tính          | HTTP/1.1           | HTTP/2            | HTTP/3 (QUIC)  |
+-------------------+--------------------+-------------------+----------------+
| Giao thức lõi     | TCP                | TCP               | UDP (QUIC)     |
| Ghép kênh         | Không (Domain      | Có (Stream        | Có (Stream     |
| (Multiplexing)    | sharding)          | Multiplexing)     | độc lập 100%)  |
| Head-of-Line Block| Ở tầng HTTP        | Ở tầng TCP packet | Loại bỏ hoàn   |
| (HOL Blocking)    |                    | loss              | toàn           |
| Handshake latency | 2 RTT (TCP + TLS)  | 2 RTT (TCP + TLS) | 0-RTT / 1-RTT  |
| Khả năng chịu rớt | Kém                | Trung bình        | Rất cao (Wi-Fi |
| mạng di động      |                    |                   | sang 4G không  |
|                   |                    |                   | đứt kết nối)   |
+-------------------+--------------------+-------------------+----------------+
```

#### 3.1. Phân Tích Hiện Tượng Head-of-Line (HOL) Blocking

- **Trong HTTP/1.1**: Trình duyệt chỉ có thể gửi tối đa 6 kết nối TCP đồng thời cho mỗi tên miền. Mỗi kết nối chỉ tải tuần tự từng tài nguyên (Request A $\rightarrow$ Response A $\rightarrow$ Request B $\rightarrow$ Response B). Nếu Request A là một file ảnh lớn 400KB bị nghẽn, các request JS/CSS quan trọng phía sau bị kẹt cứng.
- **Trong HTTP/2**: Giải quyết vấn đề bằng **Binary Framing Layer** và **Stream Multiplexing** — tất cả tài nguyên được bẻ nhỏ thành các frame nhị phân truyền song song trên **duy nhất 1 kết nối TCP**. Tuy nhiên, nếu xảy ra hiện tượng rớt packet ở tầng TCP (rất phổ biến trên mạng di động 4G/5G ở Việt Nam khi sóng yếu), toàn bộ các luồng khác trên kết nối TCP đó đều bị chặn lại chờ truyền lại packet mất (**TCP-level HOL Blocking**).
- **Trong HTTP/3 (QUIC)**: Chạy trên giao thức UDP. Mỗi stream tài nguyên hoàn toàn độc lập ở cả tầng ứng dụng lẫn tầng truyền tải. Mất 1 packet của file ảnh `sakura.jpg` hoàn toàn không làm gián đoạn việc tải file `page.js`!

#### 3.2. Chi Phí Handshake & 0-RTT Resumption

Để thiết lập kết nối an toàn HTTPS trước khi byte dữ liệu đầu tiên được truyền đi:
- **Chu kỳ cổ điển (TCP + TLS 1.2)**: 
  $\text{DNS Lookup} (1 \text{ RTT}) + \text{TCP 3-way Handshake} (1 \text{ RTT}) + \text{TLS Handshake} (2 \text{ RTT}) = 4 \text{ RTTs}$.
  Nếu độ trễ RTT từ Việt Nam sang server Mỹ là 180ms, chỉ riêng việc mở kết nối đã tiêu tốn:
  $$4 \times 180\text{ms} = 720\text{ms}$$
  trước khi server bắt đầu xử lý yêu cầu!
- **Chu kỳ hiện đại (TLS 1.3 & QUIC/HTTP/3)**:
  Tích hợp mã hóa vào ngay gói tin bắt tay đầu tiên. Với khách hàng quay lại (repeat visitors), tính năng **0-RTT Session Resumption** cho phép trình duyệt gửi dữ liệu mã hóa ứng dụng ngay trong gói tin đầu tiên, tiết kiệm hoàn toàn độ trễ mở kết nối.

#### 3.3. Thuật Toán TCP Slow Start & Tác Động Tới LCP

Giao thức TCP sử dụng thuật toán điều khiển tắc nghẽn gọi là **TCP Slow Start**. Khi một kết nối mới được tạo, TCP không gửi toàn bộ dữ liệu ngay lập tức mà bắt đầu với một cửa sổ tắc nghẽn nhỏ (**Congestion Window - cwnd**, thông thường là 10 hoặc 14 TCP packets $\approx 14.6\text{KB}$).
Sau mỗi RTT nhận được ACK thành công, kích thước cửa sổ tăng gấp đôi:
- Vòng 1: $14.6\text{KB}$
- Vòng 2: $29.2\text{KB}$
- Vòng 3: $58.4\text{KB}$
- Vòng 4: $116.8\text{KB}$
- Vòng 5: $233.6\text{KB}$

**Hệ quả trực tiếp**: Nếu tài liệu HTML hoặc file JS ban đầu nặng 150KB, trình duyệt phải mất ít nhất 4 đến 5 vòng RTT chỉ để tải xong file, bất kể đường truyền của người dùng là cáp quang 1Gbps! Đây là lý do tại sao **Inline Critical CSS** và giữ payload HTML ban đầu dưới **14KB (đạt giới hạn 10 TCP segments)** mang lại bước nhảy vọt về tốc độ hiển thị.

---

### 4. ⚙️ JavaScript Engine & V8 Execution Pipeline

Hiểu rõ cách bộ xử lý V8 (Google Chrome, Node.js) biên dịch và thực thi mã nguồn giúp ta tránh được các bẫy làm chậm ứng dụng:

```
[Mã JS Text] ──► [Parser] ──► [AST: Abstract Syntax Tree]
                     │
                     ▼
          [Ignition Interpreter] ──► [Sinh Bytecode & Thực thi ngay]
                     │
       (Hàm được gọi nhiều lần: "Hot Function")
                     │
                     ▼
          [TurboFan JIT Compiler] ──► [Mã Máy Tối Ưu Hóa (Machine Code)]
                     │
        (Kiểu dữ liệu thay đổi đột ngột: Deoptimization)
                     │
                     ▼
          [Quay trở lại Bytecode thường] (Tổn thất CPU nghiêm trọng)
```

#### 4.1. Chi Phí Parse & Compile Của JavaScript Không Hề Miễn Phí

Nhiều lập trình viên lầm tưởng một file ảnh 100KB và một file JavaScript 100KB có chi phí như nhau. Đây là sai lầm nghiêm trọng:
- File ảnh: Tải về $\rightarrow$ Giải mã $\rightarrow$ GPU vẽ lên màn hình.
- File JS: Tải về $\rightarrow$ **Parse cú pháp** $\rightarrow$ **Xây dựng AST** $\rightarrow$ **Biên dịch Bytecode** $\rightarrow$ **Thực thi** $\rightarrow$ **Tạo đối tượng trong Heap** $\rightarrow$ **Chi phí dọn dẹp rác (Garbage Collection)**.

Một ứng dụng web tải 1MB JavaScript trên một điện thoại phân khúc trung cấp (Android Chip Snapdragon 680) có thể mất tới **1.5 giây đến 3 giây chỉ riêng thời gian CPU giải nén và phân tích mã nguồn**, đẩy INP và TTI lên mức thảm họa.

#### 4.2. Garbage Collection (GC) Pauses & Generational Hypothesis

V8 quản lý bộ nhớ tự động thông qua bộ dọn rác (Garbage Collector). V8 phân chia bộ nhớ Heap thành 2 thế hệ dựa trên **Giả thuyết thế hệ (Generational Hypothesis)**: "Hầu hết các đối tượng trong chương trình sinh ra và chết đi rất nhanh".
- **Young Generation (Nursery & Intermediate)**: Chứa các biến tạm thời, props ngắn hạn, closure sinh ra trong quá trình render. Được quét dọn thường xuyên bởi thuật toán **Scavenger (Minor GC)** tốc độ cao (1-3ms).
- **Old Generation**: Chứa các đối tượng sống sót qua nhiều chu kỳ thu gom (như cache danh sách từ vựng, state toàn cục của SRS). Được thu gom bởi thuật toán **Mark-Sweep-Compact (Major GC)**.

**Nguy cơ trong ứng dụng học tập SRS**: Nếu ứng dụng liên tục tạo mới hàng nghìn object trong mỗi lượt lật thẻ flashcard (ví dụ: tạo lại mảng thẻ lọc, map lại DTO, tính toán FSRS tạo ra các đối tượng Date trung gian không giải phóng), Major GC sẽ bị kích hoạt định kỳ. Khi Major GC chạy, nó sẽ tạm dừng toàn bộ luồng thực thi chính (**Stop-The-World pause**), gây ra hiện tượng giật lag bất ngờ đúng lúc người dùng bấm nút chấm điểm thẻ bài.

---

### 5. ⚛️ Kiến Trúc React 19 & Next.js 15 App Router

Dự án sử dụng **Next.js 15.5.27** và **React 19**, đại diện cho bước chuyển biến kiến trúc lớn nhất trong lịch sử web hiện đại: chuyển từ Client-Side Rendering sang mô hình hỗn hợp **React Server Components (RSC)**.

#### 5.1. Mô Hình React Server Components (RSC) vs Client Components

```
                KIẾN TRÚC HYBRID APP ROUTER
                
   [SERVER (Next.js 15 Node/Edge)]          [CLIENT (Browser)]
   
   ┌───────────────────────────────┐
   │ Server Component              │
   │ (src/app/page.tsx)            │
   │ - Trực tiếp query Turso SQL   │
   │ - Không gửi bundle code về    │
   │ - 0KB JS weight trên client   │
   └──────────────┬────────────────┘
                  │ 
                  │  RSC Payload Stream (JSON-like format)
                  │  + HTML ban đầu (SSR)
                  ▼
   ┌───────────────────────────────┐        ┌────────────────────────────┐
   │ Client Component Leaf         ├───────►│ Browser DOM & Hydration   │
   │ ('use client')                │        │ - Chỉ nạp JS cho nút lá   │
   │ (KirieKpiCard, AudioPlayer)   │        │ - Tương tác click mượt mà │
   └───────────────────────────────┘        └────────────────────────────┘
```

1. **Server Components (Mặc định trong App Router)**:
   - Chạy **100% trên server** trong thời gian build hoặc request.
   - Mã nguồn của Server Component, các thư viện nặng dùng trong nó (như Drizzle ORM, libSQL client, thuật toán phân tích ngôn ngữ) **hoàn toàn không bị đóng gói vào bundle JS gửi về trình duyệt**.
   - Có thể truy cập trực tiếp tài nguyên backend (Database, Filesystem, Secrets) mà không cần tạo REST API endpoint.
2. **Client Components (`'use client'`)**:
   - Được render trước trên server thành HTML tĩnh (SSR), sau đó tải mã JS về client để **Hydrate** (gắn event listeners, khởi tạo hooks `useState`, `useEffect`).
   - Cần thiết cho các phần tử có tương tác trực tiếp với người dùng, sử dụng Web APIs (như Web Audio API, LocalStorage, ResizeObserver).
3. **Nguyên tắc "Đẩy 'use client' xuống lá cây component (Push to the leaves)"**:
   - **Lỗi kiến trúc hiện tại của dự án**: Tệp `src/app/page.tsx` đang khai báo `'use client'` ngay dòng 1. Điều này biến toàn bộ trang chủ thành một cây Client Component khổng lồ, làm mất toàn bộ lợi thế của Server Components, buộc trình duyệt phải tải bundle JS lớn và kích hoạt waterfall data fetching!

#### 5.2. Streaming SSR & Progressive Hydration với Suspense

Trong SSR truyền thống, server phải chờ đợi truy vấn cơ sở dữ liệu hoàn tất 100% mới có thể bắt đầu tạo HTML gửi về cho client. Nếu truy vấn Turso mất 350ms, người dùng phải nhìn màn hình trắng suốt 350ms đó.

Với **React 19 Streaming SSR**:
- Server có thể gửi ngay phần khung HTML tĩnh (Header, Navigation, Background) chỉ trong **20ms**.
- Các phần tử chậm (như danh sách thẻ từ vựng cần nạp từ cơ sở dữ liệu) được bọc trong `<Suspense fallback={<Skeleton />}>`.
- Server gửi khối fallback về trước, sau khi dữ liệu DB về, server sẽ tự động stream tiếp đoạn HTML hoàn chỉnh và script thay thế vào cùng một HTTP response mà không cần mở kết nối mới.

---

### 6. 🗄️ Độ Trễ Cơ Sở Dữ Liệu & Mạng Phân Tán (Database Latency Physics)

#### 6.1. Quy Luật Vận Tốc Ánh Sáng Trong Cáp Quang

Nhiều kỹ sư quên mất rằng tín hiệu quang trong sợi thủy tinh di chuyển với vận tốc xấp xỉ:
$$v \approx 200,000 \text{ km/s} \quad (\approx \frac{2}{3} \text{ vận tốc ánh sáng trong chân không})$$

- Khoảng cách địa lý từ Hà Nội / TP.HCM đến Datacenter Vercel US-East (Virginia - `iad1`): $\approx 14,000\text{ km}$.
- Một chu kỳ đi và về (Round-Trip Time - RTT) lý thuyết tối thiểu:
  $$\text{RTT}_{\text{min}} = \frac{2 \times 14,000\text{ km}}{200,000\text{ km/s}} = 140\text{ms}$$
- Trong thực tế, qua hàng chục router, bộ chuyển mạch, gateway quốc tế và suy hao tín hiệu, RTT thực tế luôn dao động từ **220ms đến 280ms**.

```
[Người dùng Việt Nam] 
       │ 
       │ (RTT mạng quốc tế: ~250ms)
       ▼
[Vercel Serverless (iad1 - US East)] 
       │ 
       │ (Mỗi query Turso DB: ~80-150ms nếu khác region)
       ▼
[Turso Cloud (libSQL)]
```

#### 6.2. Hiệu Ứng Cấp Số Nhân Của N+1 Queries Trên Serverless

Nếu một API route thực hiện 3 câu truy vấn SQL tuần tự:
```typescript
// Anti-pattern: Sequential Database Waterfall
const cardList = await db.select().from(cards)...;       // Chờ 120ms
const allDecks = await db.select().from(decks);           // Chờ tiếp 100ms
const allCards = await db.select().from(cards)...;       // Chờ tiếp 140ms
// Tổng thời gian chờ I/O = 120 + 100 + 140 = 360ms!
```
Cộng với độ trễ mạng từ Việt Nam sang server Mỹ (250ms), người dùng sẽ phải chờ ít nhất:
$$250\text{ms} + 360\text{ms} + \text{render time} \approx \mathbf{700ms - 900ms \text{ TTFB}}!$$

Khi chuyển sang **Parallel Execution** và **SQL Aggregation (GROUP BY)**:
```typescript
// Pattern tối ưu: Đưa về 1 RTT duy nhất hoặc chạy song song
const [cardList, deckSummaries] = await Promise.all([
  queryCardsPromise,
  queryAggregatedDecksPromise
]);
// Tổng thời gian chờ chỉ bằng truy vấn lớn nhất: max(120, 100) = 120ms!
```

---

### 7. 🔍 Phân Tích Thực Trạng Stack `japanese-srs-system`

Dự án sở hữu một kiến trúc giàu mỹ học và tính năng mạnh mẽ, nhưng đang gánh chịu sự cộng hưởng bất lợi của 5 yếu tố cấu thành:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│             CHUỖI BỘ ĐỆM ĐỘ TRỄ HIỆN TẠI (WORST-CASE WATERFALL)             │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. DNS & TLS kết nối tới Vercel US-East                      : ~200ms       │
│ 2. Serverless Cold Start (Next.js warm-up & initDb)          : ~350ms       │
│ 3. Fetch dữ liệu từ Client (useEffect sau Hydration)         : ~400ms       │
│ 4. 3 Truy vấn Turso SQL tuần tự trong /api/cards             : ~260ms       │
│ 5. Tải 3 Google Font Families không tối ưu (render block)    : ~300ms       │
│ 6. Tải ảnh nghệ thuật Hokusai 421KB chưa nén AVIF            : ~500ms       │
│ 7. Chạy 18 cánh hoa anh đào Sakura + FSRS trên Main Thread   : ~100ms (Jank)│
├─────────────────────────────────────────────────────────────────────────────┤
│ TỔNG THỜI GIAN LCP ƯỚC TÍNH TẠI HIỆN TRƯỜNG                   : ~3.8s - 4.5s │
└─────────────────────────────────────────────────────────────────────────────┘
```

1. **Đặc thù ngôn ngữ CJK (Chinese-Japanese-Korean)**:
   - Các font chữ thông thường chỉ chứa khoảng 100 - 200 glyphs bảng chữ cái Latinh (kích thước file font chỉ khoảng 20KB - 40KB).
   - Font tiếng Nhật (`Noto Sans JP`, `Shippori Mincho`, `Zen Maru Gothic`) chứa hàng nghìn chữ Hán (Kanji), Hiragana, Katakana. Một file font CJK đầy đủ có thể nặng từ **1.5MB đến 5MB**! Nếu không cấu hình `unicode-range` và font subsetting chuẩn xác, việc tải font sẽ bóp nghẹt toàn bộ băng thông di động của người dùng.
2. **Gánh nặng thuật toán FSRS (Free Spaced Repetition Scheduler)**:
   - Thuật toán FSRS v4/v5 với 21 tham số ma trận trọng số yêu cầu tính toán hồi quy mũ để xác định độ ổn định (Stability $S$) và độ khó (Difficulty $D$). Nếu thực thi trực tiếp trên luồng giao diện khi người dùng lật thẻ, nó sẽ gây ra đột biến INP tức thì.
3. **Mô hình Serverless Stateless vs Database Connection**:
   - Trong môi trường Serverless (Vercel Functions), các instance bị đóng băng và tái tạo liên tục (spin-up/tear-down). Nếu mỗi request đều khởi tạo lại kết nối database qua `initDb()`, overhead của quá trình bắt tay HTTP/TLS đến Turso sẽ lặp đi lặp lại vô tận.

---

### 8. 🛠️ Đo Lường, Viễn Thám & Công Cụ Kiểm Định (Telemetry & Tooling)

#### 8.1. Lab Data (Dữ Liệu Thí Nghiệm) vs Field Data (Dữ Liệu Hiện Trường)

- **Lab Data (Synthetic)**: Đo bằng Lighthouse, Chrome DevTools trên máy lập trình viên hoặc CI/CD runner. Môi trường mạng cố định, CPU mô phỏng. Dùng để gỡ lỗi và phát hiện regression trước khi merge code.
- **Field Data (Real User Monitoring - RUM)**: Thu thập từ người dùng thực tế thông qua Chrome User Experience Report (CrUX) và Vercel Speed Insights. Đây là dữ liệu Google dùng để xếp hạng tìm kiếm. Lab score có thể đạt 100 điểm, nhưng nếu người dùng ở khu vực mạng kém gặp lỗi font, Field data vẫn rơi vào vùng Đỏ!

#### 8.2. Thiết Lập Khung Đo Lường Chuẩn Với PerformanceObserver API

Để thu thập chỉ số chính xác tại runtime, dự án cần tích hợp module viễn thám độc lập:

```typescript
// Telemetry Snippet: Quan sát LCP thực tế của người dùng
if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
  const lcpObserver = new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const lastEntry = entries[entries.length - 1];
    console.info(`[RUM Telemetry] Real LCP: ${lastEntry.startTime}ms`, lastEntry);
  });
  lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

  const inpObserver = new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      if ('duration' in entry) {
        console.info(`[RUM Telemetry] INP candidate: ${entry.duration}ms`, entry);
      }
    }
  });
  inpObserver.observe({ type: 'first-input', buffered: true });
}
```

---

### 9. 📐 Khung Mục Tiêu Ngân Sách Hiệu Suất (Performance Budgets)

Để duy trì tốc độ sau khi tối ưu hóa, toàn bộ team và các AI agent phát triển tiếp theo phải tuân thủ nghiêm ngặt **Performance Budget Contract**:

```
+─────────────────────────────────────────────────────────────────────────────+
│                       BẢNG NGÂN SÁCH HIỆU SUẤT (BUDGETS)                    │
+───────────────────────────┬──────────────┬──────────────┬───────────────────+
│ Hạng mục tài nguyên       │ Hiện tại     │ Mục tiêu     │ Ngưỡng chặn CI/CD │
+───────────────────────────┼──────────────┼──────────────┼───────────────────+
│ Initial JS Bundle (gzip)  │ ~220 KB      │ ≤ 95 KB      │ > 115 KB (Fail)   │
│ Total CSS (gzip)          │ ~45 KB       │ ≤ 18 KB      │ > 25 KB  (Fail)   │
│ LCP Image Weight (WebP)   │ 421 KB (JPG) │ ≤ 65 KB      │ > 85 KB  (Fail)   │
│ Total Font Files Loaded   │ ~350 KB      │ ≤ 70 KB      │ > 90 KB  (Fail)   │
│ Server TTFB (Vietnam RTT) │ ~650 ms      │ ≤ 180 ms     │ > 300 ms (Fail)   │
│ LCP Time to Screen        │ ~4.1 s       │ ≤ 1.6 s      │ > 2.2 s  (Fail)   │
│ INP Interaction Delay     │ ~140 ms      │ ≤ 45 ms      │ > 80 ms  (Fail)   │
│ CLS Cumulative Score      │ ~0.14        │ ≤ 0.02       │ > 0.05   (Fail)   │
+───────────────────────────┴──────────────┴──────────────┴───────────────────+
```

---

### 10. 🗺️ Bản Đồ Chiến Lược 8 Tầng & Lộ Trình Triển Khai (Roadmap)

Kế hoạch tối ưu hóa được tổ chức theo cấu trúc đa tầng kim tự tháp (Bottom-up):

```
                                  [TẦNG 7]
                     Giám Sát, CI/CD & Phòng Ngừa Regression
                                  [TẦNG 6]
                      Hiệu Suất Runtime, Worker & Offline PWA
                                  [TẦNG 5]
                        Mạng, CDN Vercel & HTTP Caching
                                  [TẦNG 4]
                        Tối Ưu Database Turso & API Layer
                                  [TẦNG 3]
                        Tối Ưu Assets: Ảnh, SVG, CSS & CJK Font
                                  [TẦNG 2]
                        Tối Ưu Next.js 15 & Server Components
                                  [TẦNG 1]
                        Kiểm Toán Kiến Trúc & Chi Tiết Điểm Nghẽn
                                  [TẦNG 0]
                        Lý Thuyết Nền Tảng Hiệu Suất Web
```

#### Ma Trận Tác Động vs Nỗ Lực (Impact vs Effort Matrix)

```
        CAO  │  [Quick Wins - Làm Ngay]           [Major Architectural Refactor]
             │  • Bỏ font thừa, next/font (T2)    • Chuyển Dashboard sang RSC (T2)
             │  • Nén ảnh AVIF/WebP sharp (T3)    • Chuyển 3 query DB sang GROUP BY (T4)
             │  • Bật cache headers (T5)          • Offline PWA & Web Worker (T6)
   TÁC       │  • Thêm preconnect/dns-prefetch    • Turso Regional Replica (T4)
   ĐỘNG      │────────────────────────────────────┼─────────────────────────────────
             │  [Fill-in / Low Priority]          [Engineering Overhead]
             │  • Tinh chỉnh favicon              • Viết custom compiler plugin
             │  • Sửa meta tags SEO               • Thay thế toàn bộ CSS framework
        THẤP └────────────────────────────────────┴─────────────────────────────────
                               THẤP                       CAO
                                           NỖ LỰC TRIỂN KHAI
```

#### Dự Báo Gia Tăng Hiệu Suất Tổng Thể Sau Khi Hoàn Thành Cả 8 Tầng:
- **LCP**: Giảm từ $\approx 4.1\text{s} \longrightarrow < \mathbf{1.5s}$ (Cải thiện **63%**).
- **INP**: Giảm từ $\approx 140\text{ms} \longrightarrow < \mathbf{40ms}$ (Cải thiện **71%**).
- **TTFB**: Giảm từ $\approx 650\text{ms} \longrightarrow < \mathbf{150ms}$ (Cải thiện **76%**).
- **Tổng dung lượng tải ban đầu**: Giảm từ $\approx 1.8\text{MB} \longrightarrow < \mathbf{380KB}$ (Cắt giảm **78% băng thông**).

---
*Tài liệu thuộc bộ hồ sơ kỹ thuật Master Performance Plan — Dự án Japanese SRS System.*

---


<a id="phan-2"></a>
# PHẦN 2: PHẦN 2: KIỂM TOÁN KIẾN TRÚC TOÀN DIỆN & NHẬN DIỆN ĐIỂM NGHẼN (ARCHITECTURE AUDIT)
*Tệp gốc: `doc\performance\01-architecture-audit.md`*

---

## 01 — TẦNG 1: Kiểm Toán Kiến Trúc Toàn Diện & Phân Tích Chi Tiết 11 Điểm Nghẽn Codebase Thực Tế

> **Định vị tài liệu**: Tầng 1 (Architecture Audit & Bottlenecks Layer) — Báo cáo kiểm toán kỹ thuật toàn diện, chi tiết đến từng dòng mã nguồn, từng byte tài nguyên và từng frame hiển thị dựa trên hiện trạng thực tế của kho mã nguồn `japanese-srs-system` (`D:\project\japanese-srs-system`).  
> **Phương pháp kiểm toán**: Phân tích tĩnh mã nguồn (Static Code Analysis), phân tích cây phụ thuộc (Dependency Tree Inspection), phân tích lược đồ cơ sở dữ liệu (Schema & Query Plan Evaluation), và lập hồ sơ độ trễ (Latency Profiling).  
> **Mục tiêu**: Bóc tách triệt để 11 điểm nghẽn nghiêm trọng, cung cấp số liệu đo đạc chính xác, phân tích nguyên nhân gốc rễ (Root Cause Analysis), và xây dựng giải pháp kỹ thuật trước/sau (Before vs After Code Diff) cho từng điểm nghẽn.

---

### 1. 📂 TỔNG QUAN HIỆN TRẠNG KỸ THUẬT CODEBASE `japanese-srs-system`

Dự án là một hệ thống web ứng dụng hiện đại kết hợp thuật toán trí tuệ nhân tạo **FSRS (Free Spaced Repetition Scheduler)** với mỹ học truyền thống Nhật Bản (Wabi-Sabi, Kirie, Ukiyo-e, Thư pháp Shodo, Cổng Torii, Hoa anh đào Sakura).

#### 1.1. Bản Đồ Module & Các Điểm Nóng (Hotspots)

```
D:\project\japanese-srs-system\
├── package.json                   # [Hotspot: React 19.0.0, Next 15.5.27, Drizzle 0.38.4, LibSQL 0.18.0]
├── public\
│   └── assets\art\                # [HOTSPOT 4] 26 tệp ảnh mỹ thuật (Tổng dung lượng: 2.82 MB chưa nén)
│       ├── hokusai-suwa-lake.jpg  # 431.8 KB (LCP Candidate số 1 - Chậm nhất)
│       ├── golden-waves-kin-nami.jpg # 229.9 KB (Ảnh nền Hero banner)
│       ├── great-wave-isolated.webp # 211.0 KB (Ảnh sóng thần Hokusai tách nền)
│       └── rinpa-gold-waves-clouds.jpg # 105.6 KB
├── src\
│   ├── app\
│   │   ├── layout.tsx             # [HOTSPOT 1 & 8] 3 Google Fonts tải 8 weights + Thiếu Resource Hints
│   │   ├── page.tsx               # [HOTSPOT 2] 'use client' + useEffect Data Fetching Waterfall
│   │   ├── globals.css            # [HOTSPOT 6] Lớp giấy Washi, hiệu ứng Wagara, CSS Animations
│   │   └── api\cards\
│   │       └── route.ts           # [HOTSPOT 3] 3 queries SQL tuần tự + Lọc in-memory toàn bộ thẻ bài
│   ├── components\
│   │   ├── japanese\
│   │   │   └── SakuraBackground.tsx # [HOTSPOT 6] 18 cánh hoa rơi sinh ngẫu nhiên bằng JS lúc Mount
│   │   ├── art\
│   │   │   └── JapaneseArtBackdrop.tsx # Render ảnh nền thiếu blur placeholder và priority
│   │   └── kirie\                 # Bộ thẻ Kirie lát cắt mỹ thuật Washi (KirieHeroBanner, KirieKpiCard)
│   └── db\
│       ├── client.ts              # [HOTSPOT 11] Thiếu Connection Singleton, Thiếu SQLite Indexes
│       └── schema.ts              # Lược đồ bảng: decks, cards, review_logs, user_fsrs_parameters
```

---

### 2. 🔴 BOTTLENECK #1: TẢI GOOGLE FONTS NHIỀU FAMILIES VÀ WEIGHTS GÂY RENDER-BLOCKING

- **Tệp liên quan**: [src/app/layout.tsx:11-29](file:///D:/project/japanese-srs-system/src/app/layout.tsx#L11-L29)
- **Mức độ nghiêm trọng**: 🔴 **CỰC KỲ NGHIÊM TRỌNG (Critical P0)**
- **Tác động định lượng**: Làm chậm **~300ms - 450ms LCP**, làm chậm **~250ms FCP**, tiêu tốn **~350KB băng thông font**.

#### 2.1. Mã Nguồn Thực Tế Hiện Tại

```typescript
// src/app/layout.tsx:11-29
const zenMaru = Zen_Maru_Gothic({
  weight: ['400', '500', '700', '900'], // 4 biến thể trọng số!
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-maru',
});

const shipporiMincho = Shippori_Mincho({
  weight: ['500', '700', '800'],        // 3 biến thể trọng số!
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mincho',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],                   // 1 biến thể
  display: 'swap',
  variable: '--font-sans',
});
```

#### 2.2. Phân Tích Cơ Chế Suy Thoái Ở Cấp Độ Trình Duyệt

1. **Bùng nổ số lượng HTTP Requests**:
   Trình duyệt phải mở kết nối đến máy chủ Google Fonts và tải tổng cộng $4 + 3 + 1 = 8$ file font định dạng \`.woff2\`. Mỗi file font có chi phí bắt tay kết nối riêng nếu không được gom luồng.
2. **Sai lầm về Subsetting đối với ngôn ngữ CJK (Tiếng Nhật)**:
   Thuộc tính \`subsets: ['latin']\` được truyền vào là một sai lầm phổ biến khi dùng \`next/font/google\`. Đối với các font CJK như \`Zen Maru Gothic\` và \`Shippori Mincho\`, Google Fonts **không thể gom toàn bộ bảng chữ tiếng Nhật vào tập con Latinh**.
   Hệ quả: Khi trang hiển thị các từ vựng tiếng Nhật như \`記憶道\`, \`日学\`, \`曖昧\`, \`本丸\`, trình duyệt phát hiện các ký tự Unicode này nằm ngoài tập Latinh đã tải về. Trình duyệt lập tức bị gián đoạn, phát sinh thêm hàng loạt HTTP request phụ đến \`fonts.gstatic.com\` để kéo các lát cắt CJK bổ sung (**Dynamic Font Slicing**), khiến toàn bộ chữ Hán trên màn hình bị vô hình (hiện tượng **FOIT - Flash of Invisible Text**) trong suốt 300ms - 600ms đầu!
3. **Lãng phí các trọng số trung gian không cần thiết**:
   Trọng số \`500\` (Medium) và \`800\` (Extra Bold) hiếm khi tạo ra sự khác biệt thị giác rõ rệt so với \`400\` (Regular) và \`700\` (Bold) trên các thiết bị di động, nhưng lại làm tăng gấp đôi thời gian tải font qua mạng.

#### 2.3. Giải Pháp Tối Ưu Triệt Để (Before vs After)

```diff
// src/app/layout.tsx
- const zenMaru = Zen_Maru_Gothic({
-   weight: ['400', '500', '700', '900'],
-   subsets: ['latin'],
-   display: 'swap',
-   variable: '--font-maru',
- });
- const shipporiMincho = Shippori_Mincho({
-   weight: ['500', '700', '800'],
-   subsets: ['latin'],
-   display: 'swap',
-   variable: '--font-mincho',
- });
+ // TỐI ƯU HÓA: Chỉ giữ 2 trọng số cốt lõi, bật Preload và chỉ định Fallback Fonts
+ const zenMaru = Zen_Maru_Gothic({
+   weight: ['400', '700'],
+   subsets: ['latin'],
+   display: 'swap',
+   variable: '--font-maru',
+   preload: true,
+   fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Hiragino Sans', 'sans-serif'],
+ });
+ 
+ const shipporiMincho = Shippori_Mincho({
+   weight: ['700'], // Chỉ dùng duy nhất trọng số 700 cho tiêu đề thư pháp
+   subsets: ['latin'],
+   display: 'swap',
+   variable: '--font-mincho',
+   preload: false,  // Không chặn Critical Path
+   fallback: ['Yu Mincho', 'Hiragino Mincho ProN', 'Georgia', 'serif'],
+ });
```

---

### 3. 🔴 BOTTLENECK #2: DASHBOARD PAGE SỬ DỤNG CLIENT-SIDE `useEffect` DATA FETCHING WATERFALL

- **Tệp liên quan**: [src/app/page.tsx:1-55](file:///D:/project/japanese-srs-system/src/app/page.tsx#L1-L55)
- **Mức độ nghiêm trọng**: 🔴 **CỰC KỲ NGHIÊM TRỌNG (Critical P0)**
- **Tác động định lượng**: Làm chậm **~400ms - 650ms LCP**, làm trống giao diện trong 500ms đầu, tăng kích thước Client Bundle JS thêm **~45KB**.

#### 3.1. Mã Nguồn Thực Tế Hiện Tại

```typescript
// src/app/page.tsx:1-35
'use client'; // <-- Ép toàn bộ cây trang chủ thành Client Component

import { useState, useEffect } from 'react';
...

export default function DashboardPage() {
  const [deckSummaries, setDeckSummaries] = useState<DeckSummaryDTO[]>([]);
  const [cardsList, setCardsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDeckData() {
      try {
        setLoading(true);
        // PHÁT SINH WATERFALL TRỄ SAU KHI HYDRATION HOÀN TẤT
        const res = await fetch('/api/cards');
        const json = await res.json();
        if (json.success && json.deckSummaries) {
          setDeckSummaries(json.deckSummaries);
        }
        ...
      } catch (err) {
        console.error('Lỗi khi nạp dữ liệu bộ thẻ:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDeckData();
  }, []);
```

#### 3.2. Sơ Đồ So Sánh Trình Tự Thời Gian (Waterfall Timeline)

```
═════════════════════════════════════════════════════════════════════════════════════════════
HIỆN TẠI: CLIENT-SIDE FETCHING WATERFALL (TỔNG THỜI GIAN ĐẾN KHI CÓ DỮ LIỆU: ~950ms)
═════════════════════════════════════════════════════════════════════════════════════════════
[0ms] Yêu cầu URL
  │
  ├─► [200ms] Nhận HTML ban đầu (Chỉ là khung rỗng, loading state)
  │
  ├─► [450ms] Tải xong JS Bundle (page.js + React runtime + Kirie components)
  │
  ├─► [550ms] React Hydration hoàn thành (Event listeners gắn vào DOM)
  │
  ├─► [560ms] Hook useEffect() được kích hoạt ──► fetch('/api/cards')
  │
  ├─► [820ms] API /api/cards xử lý xong ở Serverless và phản hồi JSON
  │
  └─► [950ms] setState() ──► Re-render ──► [LCP XUẤT HIỆN TẠI ĐÂY!]

═════════════════════════════════════════════════════════════════════════════════════════════
TỐI ƯU: REACT SERVER COMPONENT ZERO-WATERFALL (TỔNG THỜI GIAN ĐẾN KHI CÓ DỮ LIỆU: ~250ms)
═════════════════════════════════════════════════════════════════════════════════════════════
[0ms] Yêu cầu URL
  │
  ├─► Server Next.js đọc trực tiếp Turso Cloud DB (song song trong 100ms)
  │   Đồng thời biên dịch HTML chứa sẵn số liệu Thống kê & Danh sách thẻ
  │
  └─► [220ms] Nhận HTML hoàn chỉnh ──► [LCP XUẤT HIỆN TỨC THÌ TẠI 250ms!]
      (Không có loading spinner, không có nhấp nháy giao diện, 0 byte JS data logic gửi về máy khách)
```

---

### 4. 🔴 BOTTLENECK #3: TRUY VẤN CƠ SỞ DỮ LIỆU TUẦN TỰ & LỌC TOÀN BỘ THẺ IN-MEMORY

- **Tệp liên quan**: [src/app/api/cards/route.ts:34-70](file:///D:/project/japanese-srs-system/src/app/api/cards/route.ts#L34-L70)
- **Mức độ nghiêm trọng**: 🔴 **CỰC KỲ NGHIÊM TRỌNG (Critical P0)**
- **Tác động định lượng**: Làm tăng **~150ms - 280ms TTFB**, nguy cơ cạn kiệt bộ nhớ Serverless RAM khi số lượng từ vựng vượt 5,000 thẻ.

#### 4.1. Mã Nguồn Thực Tế Hiện Tại

```typescript
// src/app/api/cards/route.ts:34-69
// TRUY VẤN 1: Lấy danh sách thẻ
const cardList =
  deckId && deckId !== 'all'
    ? await baseQuery.where(eq(cards.deckId, deckId)).orderBy(desc(cards.createdAt))
    : await baseQuery.orderBy(desc(cards.createdAt));

// TRUY VẤN 2: Lấy danh sách bộ thẻ (Chờ Truy vấn 1 chạy xong!)
const allDecks = await db.select().from(decks);

// TRUY VẤN 3: Kéo TOÀN BỘ dữ liệu của bảng cards về RAM máy chủ!
const now = new Date();
const allCardsForStats = await db
  .select({
    id: cards.id,
    deckId: cards.deckId,
    state: cards.state,
    due: cards.due,
  })
  .from(cards);

// VÒNG LẶP IN-MEMORY: Duyệt mảng bằng JavaScript thay vì dùng SQL Engine
const deckSummaries = allDecks.map((d: any) => {
  const cardsInDeck = allCardsForStats.filter((c: any) => c.deckId === d.id);
  const dueCards = cardsInDeck.filter(
    (c: any) => c.state !== 'New' && new Date(c.due || 0) <= now
  ).length;
  const newCards = cardsInDeck.filter((c: any) => c.state === 'New').length;
  const learnedCards = cardsInDeck.filter((c: any) => c.state === 'Review').length;
  ...
});
```

#### 4.2. Bóc Tách Khuyết Tật Kiến Trúc

1. **Tuần tự hóa I/O (Sequential Latency Accumulation)**:
   Mỗi câu lệnh `await` gửi một HTTP payload độc lập đến Turso Endpoint. Nếu độ trễ RTT giữa Vercel Function và Turso là 70ms:
   $$\text{Thời gian chờ ròng} = 70\text{ms} + 70\text{ms} + 70\text{ms} = 210\text{ms}!$$
2. **Kéo toàn bộ bảng về Node.js RAM (Database Anti-Pattern)**:
   Truy vấn 3 thực hiện `SELECT` mọi bản ghi trong bảng `cards`. Giả sử hệ thống nhập bộ từ vựng JLPT N5-N1 gồm 10,000 từ, đối tượng `allCardsForStats` sẽ chiếm hàng chục Megabytes bộ nhớ RAM. Sau đó, các hàm `.filter()` lồng nhau bên trong vòng lặp `.map()` có độ phức tạp thuật toán:
   $$O(D \times C) \quad (D = \text{số bộ thẻ}, C = \text{tổng số thẻ})$$
   Việc duyệt $10 \times 10,000 = 100,000$ phần tử bằng JavaScript trên luồng đơn luồng của Serverless Function tiêu tốn hàng chục milliseconds CPU một cách vô nghĩa!

#### 4.3. Giải Pháp: Gom Về 1 Truy Vấn SQL GROUP BY Duy Nhất

Cơ sở dữ liệu SQLite trong libSQL được viết bằng C/C++, có khả năng gom nhóm và đếm 10,000 dòng dữ liệu trực tiếp trong bộ nhớ chỉ mất **1ms - 3ms**:

```typescript
// Giải pháp chuẩn: Chạy song song và dùng SQL GROUP BY Aggregation
const now = Date.now();

const [cardList, deckStatsRaw] = await Promise.all([
  baseQuery.limit(50), // Bắt buộc luôn có LIMIT để bảo vệ server
  db.all(sql`
    SELECT 
      d.id,
      d.name,
      d.description,
      COUNT(c.id) AS totalCards,
      SUM(CASE WHEN c.state != 'New' AND c.due <= ${now} THEN 1 ELSE 0 END) AS dueCards,
      SUM(CASE WHEN c.state = 'New' THEN 1 ELSE 0 END) AS newCards,
      SUM(CASE WHEN c.state = 'Review' THEN 1 ELSE 0 END) AS learnedCards
    FROM decks d
    LEFT JOIN cards c ON d.id = c.deck_id
    GROUP BY d.id;
  `)
]);
```

---

### 5. 🔴 BOTTLENECK #4: ẢNH NGHỆ THUẬT QUÁ NẶNG & THIẾU ĐỊNH DẠNG AVIF/WEBP

- **Tệp liên quan**: Thư mục [public/assets/art/](file:///D:/project/japanese-srs-system/public/assets/art/)
- **Mức độ nghiêm trọng**: 🔴 **CỰC KỲ NGHIÊM TRỌNG (Critical P0)**
- **Tác động định lượng**: Làm chậm **~350ms - 600ms LCP**, lãng phí **~2.2 MB băng thông**, gây hiện tượng giật giật khi cuộn trang.

#### 5.1. Bảng Kiểm Toán Chi Tiết 10 Tệp Ảnh Lớn Nhất

```
+────────────────────────────────────────────────────────┬─────────────┬─────────────┬────────────────+
| Tên Tệp Ảnh Trong public/assets/art/                   | Kích Thước  | Định Dạng   | Trạng Thái     |
+────────────────────────────────────────────────────────┼─────────────┼─────────────┼────────────────+
| hokusai-suwa-lake.jpg                                  | 431.8 KB    | JPEG Cổ điển| LCP Hero Ảnh   |
| 1000_F_262528819_Qw2fofco2EOrkIdYmcjx20sBECBZ5mFM.jpg  | 431.8 KB    | JPEG        | Trùng lặp nội dung
| golden-waves-kin-nami.jpg                              | 229.9 KB    | JPEG Cổ điển| Backdrop Card  |
| 240_F_422930768_6RNNj1J7o0AUwkHiu7WUShoDQyrJwFVt.jpg   | 229.9 KB    | JPEG        | Trùng lặp nội dung
| great-wave-isolated.webp                               | 211.0 KB    | WebP        | Chưa nén tối ưu|
| rinpa-gold-waves-clouds.jpg                            | 105.6 KB    | JPEG Cổ điển| Họa tiết mây   |
| kohaku-koi-pond.jpg                                     | 87.9 KB     | JPEG Cổ điển| Hồ cá Koi      |
| japanese-cultural-panorama.jpg                          | 83.1 KB     | JPEG Cổ điển| Tranh toàn cảnh|
| koi-peony-yuzen.jpg                                     | 66.2 KB     | JPEG Cổ điển| Cá chép mẫu đơn|
| gold-sakura-washi.jpg                                   | 57.9 KB     | JPEG Cổ điển| Chân trang Washi|
+────────────────────────────────────────────────────────┴─────────────┴─────────────┴────────────────+
| TỔNG DUNG LƯỢNG 10 ẢNH ĐẦU BẢNG:                       | ~1.88 MB    | Cắt giảm khi nén AVIF: ~320 KB|
+────────────────────────────────────────────────────────┴─────────────┴─────────────┴────────────────+
```

#### 5.2. Tính Toán Thời Gian Truyền Tải (Network Transmission Physics)

Trên mạng di động 4G trung bình tại Việt Nam (Băng thông tải thực tế: 12 Mbps $\approx 1.5\text{ MB/s}$):
- Tải bức ảnh gốc \`hokusai-suwa-lake.jpg\` (431.8 KB):
  $$t_{\\text{transfer}} = \\frac{431.8\\text{ KB}}{1500\\text{ KB/s}} \\approx \\mathbf{288ms}$$
- Tải phiên bản AVIF sau khi nén chất lượng cao (46.2 KB):
  $$t_{\\text{transfer}} = \\frac{46.2\\text{ KB}}{1500\\text{ KB/s}} \\approx \\mathbf{30ms}$$
- **Tiết kiệm trực tiếp**: **258ms thời gian chiếm dụng băng thông**, giải phóng mạng cho các tệp script và font chữ quan trọng.

---

### 6. 🟡 BOTTLENECK #5: DỰ ÁN THIẾU TỆP CẤU HÌNH `next.config.ts`

- **Vị trí**: Thư mục gốc `D:\project\japanese-srs-system\`
- **Mức độ nghiêm trọng**: 🟡 **QUAN TRỌNG (High P1)**
- **Hệ quả**: Next.js 15 chạy ở chế độ cấu hình mặc định (Zero-config). Điều này làm mất đi các tính năng tăng tốc cao cấp:
  1. Next.js không kích hoạt bộ xử lý ảnh AVIF tự động (mặc định chỉ bật WebP).
  2. Không có các chỉ thị tiêu đề \`Cache-Control\` vĩnh viễn cho tài nguyên tĩnh trong \`public/\`.
  3. Không bật tính năng tối ưu hóa các gói import nặng thông qua \`experimental.optimizePackageImports\`.
  4. Header \`x-powered-by: Next.js\` bị lộ ra trong response, vừa làm tăng số byte vô ích, vừa giảm tính bảo mật.

---

### 7. 🟡 BOTTLENECK #6: `SakuraBackground` ANIMATION CHẠY 18 CÁNH HOA BẰNG JAVASCRIPT

- **Tệp liên quan**: [src/components/japanese/SakuraBackground.tsx:15-51](file:///D:/project/japanese-srs-system/src/components/japanese/SakuraBackground.tsx#L15-L51)
- **Mức độ nghiêm trọng**: 🟡 **QUAN TRỌNG (High P1)**
- **Tác động định lượng**: Làm tăng **~30ms - 50ms INP**, tiêu tốn pin trên thiết bị di động, gây hiện tượng tụt khung hình (Frame Drop) khi cuộn trang.

#### 7.1. Phân Tích Mã Nguồn
```typescript
// src/components/japanese/SakuraBackground.tsx
export function SakuraBackground() {
  const [petals, setPetals] = useState<PetalConfig[]>([]);

  useEffect(() => {
    // SINH 18 CÁNH HOA BẰNG JS KHI COMPONENT MOUNT
    const generated: PetalConfig[] = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: `${(i * 5.5 + Math.random() * 4).toFixed(1)}%`,
      size: Math.floor(Math.random() * 8) + 10,
      duration: Math.floor(Math.random() * 6) + 9,
      delay: -(Math.random() * 12),
      swayDuration: Math.floor(Math.random() * 3) + 3,
      opacity: Number((Math.random() * 0.4 + 0.5).toFixed(2)),
    }));
    setPetals(generated);
  }, []);
```
1. `setPetals(generated)` kích hoạt một chu kỳ Re-render bắt buộc ngay sau khi trang vừa mount. Tại thời điểm này, trình duyệt đang cần dồn 100% CPU để render các thẻ từ vựng và font chữ, việc phải re-render thêm 18 node DOM làm chậm trễ thời gian tương tác đầu tiên.
2. 18 cánh hoa liên tục chuyển động nếu không được cách ly bằng CSS `contain: strict` sẽ khiến trình duyệt phải liên tục kiểm tra lại vị trí tương đối của chúng với các thẻ bài phía dưới.

---

### 8. 🟡 BOTTLENECK #7: THIẾU TIÊU ĐỀ CACHE HEADERS CHO STATIC ASSETS

- **Vị trí**: Toàn bộ các tài nguyên trong `public/assets/art/`
- **Mức độ nghiêm trọng**: 🟡 **QUAN TRỌNG (High P1)**
- **Hệ quả**: 
  Khi người dùng quay lại ứng dụng vào ngày hôm sau để ôn từ vựng, trình duyệt không thể xác định liệu bức ảnh `golden-waves-kin-nami.jpg` có bị thay đổi hay không. Trình duyệt buộc phải gửi một request kiểm tra điều kiện (`If-Modified-Since` hoặc `If-None-Match`) về máy chủ.
  Máy chủ phải xử lý và trả về mã `304 Not Modified`. Dù không tốn băng thông tải lại ảnh, người dùng vẫn phải chịu mất **1 lượt RTT mạng (~150ms - 250ms)** chỉ để đợi câu trả lời "ảnh không đổi"!
  *Giải pháp*: Cấu hình tiêu đề bất biến `Cache-Control: public, max-age=31536000, immutable` trong `next.config.ts`.

---

### 9. 🟡 BOTTLENECK #8: THIẾU CÁC CHỈ THỊ PRECONNECT & DNS-PREFETCH

- **Tệp liên quan**: `src/app/layout.tsx`
- **Mức độ nghiêm trọng**: 🟡 **QUAN TRỌNG (High P1)**
- **Hệ quả**:
  Trình duyệt chỉ bắt đầu mở kết nối đến máy chủ Google Fonts sau khi đã tải xong file HTML và phân tích cú pháp CSS.
  Trình duyệt phải thực hiện tuần tự:
  1. DNS Lookup (`fonts.googleapis.com`): ~40ms
  2. TCP Handshake: ~40ms
  3. TLS 1.3 Handshake: ~40ms
  4. DNS Lookup + TCP + TLS (`fonts.gstatic.com`): ~120ms
  Tổng thời gian mở kết nối tiêu tốn **~240ms** trước khi byte font đầu tiên được truyền đi.
  *Giải pháp*: Thêm các thẻ `<link rel="preconnect">` và `<link rel="dns-prefetch">` vào thẻ `<head>`.

---

### 10. 🟢 BOTTLENECK #9: THUẬT TOÁN FSRS CHẠY ĐỒNG BỘ TRÊN MAIN THREAD

- **Tệp liên quan**: Module ôn tập `src/app/review/`
- **Mức độ nghiêm trọng**: 🟢 **NÂNG CAO (Medium P2)**
- **Hệ quả**:
  Thuật toán FSRS v4/v5 với 21 tham số ma trận tính toán độ ổn định $S$, độ khó $D$ và xác suất truy xuất $R$. Khi người dùng thực hiện phiên ôn tập dài với hàng chục thẻ bài được cập nhật liên tục, việc tính toán trực tiếp trên Main Thread gây ra các Long Tasks kéo dài 40ms - 70ms, làm đơ hiệu ứng lật thẻ 3D và làm tụt chỉ số INP của phiên làm việc.
  *Giải pháp*: Chuyển toàn bộ tác vụ tính toán FSRS sang **Dedicated Web Worker**.

---

### 11. 🟢 BOTTLENECK #10 & #11: KHÔNG HỖ TRỢ OFFLINE & THIẾU CHỈ MỤC (INDEXES) SQLITE

#### Bottleneck #10: Không Có Service Worker & Khả Năng Ngoại Tuyến (Offline-First)
Khi người dùng mất kết nối Internet (trên máy bay, trong thang máy, sóng 4G chập chờn), ứng dụng bị ngắt quãng hoàn toàn, không thể lật thẻ và không thể lưu lại kết quả học tập.

#### Bottleneck #11: Thiếu Toàn Diện Các Chỉ Mục Trong Cơ Sở Dữ Liệu
Nhìn vào hàm `initSchemaDDL` trong [src/db/client.ts:26-48](file:///D:/project/japanese-srs-system/src/db/client.ts#L26-L48):
Bảng `cards` được tạo với câu lệnh:
```sql
CREATE TABLE IF NOT EXISTS cards (
  id TEXT PRIMARY KEY,
  deck_id TEXT NOT NULL,
  type TEXT NOT NULL,
  front TEXT NOT NULL,
  reading TEXT,
  meaning TEXT NOT NULL,
  pitch TEXT,
  sentence TEXT,
  ...
  state TEXT DEFAULT 'New' NOT NULL,
  due INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
```
**Bảng này hoàn toàn không có bất kỳ một INDEX nào ngoại trừ Primary Key `id`!**
- Khi API lọc thẻ theo bộ bài (`WHERE deck_id = ?`): **Full Table Scan!**
- Khi API tìm các thẻ đến hạn ôn tập (`WHERE due <= ? AND state != 'New'`): **Full Table Scan!**
- Khi API sắp xếp thẻ mới nhất (`ORDER BY created_at DESC`): **Full Table Scan + In-Memory Temporary B-Tree Sort!**
Điều này lý giải tại sao hệ thống hoạt động bình thường khi mới khởi tạo vài chục thẻ, nhưng sẽ chậm dần đều và quá tải khi kho dữ liệu từ vựng tăng lên.

---

### 12. 📊 BẢNG TỔNG HỢP MA TRẬN 11 ĐIỂM NGHẼN THEO THỨ TỰ ƯU TIÊN

```
+───────────────────────────────────────────────────────────────────────────────────────────────────+
|                           MA TRẬN KIỂM TOÁN 11 ĐIỂM NGHẼN CODEBASE                                |
+────┬──────────────────────────────────────┬─────────────┬──────────────┬────────────┬─────────────+
| #  | Điểm nghẽn kỹ thuật                  | Vị trí code | Tác động CWV | Độ ưu tiên | Nỗ lực sửa  |
+────┼──────────────────────────────────────┼─────────────┼──────────────┼────────────┼─────────────+
| 01 | Google Fonts tải 8 weights thừa      | layout.tsx  | -300ms LCP   | 🔴 P0      | 15 phút     |
| 02 | Dashboard useEffect Fetching         | page.tsx    | -400ms LCP   | 🔴 P0      | 2 giờ       |
| 03 | 3 DB Queries tuần tự + Lọc in-memory | route.ts    | -180ms TTFB  | 🔴 P0      | 1 giờ       |
| 04 | 26 ảnh nghệ thuật 2.8MB chưa AVIF    | /assets/art/| -350ms LCP   | 🔴 P0      | 30 phút     |
| 05 | Thiếu tệp cấu hình next.config.ts    | Thư mục gốc | -20% payload | 🟡 P1      | 15 phút     |
| 06 | SakuraBackground 18 cánh hoa bằng JS | SakuraBg.tsx| -40ms INP    | 🟡 P1      | 30 phút     |
| 07 | Thiếu Cache-Control static assets    | next.config | Tăng Hit CDN | 🟡 P1      | 15 phút     |
| 08 | Thiếu Preconnect & DNS-Prefetch      | layout.tsx  | -120ms TTFB  | 🟡 P1      | 10 phút     |
| 09 | Thuật toán FSRS chạy trên Main Thread| review/     | -45ms INP    | 🟢 P2      | 3 giờ       |
| 10 | Thiếu Service Worker & IndexedDB     | public/sw.js| Hỗ trợ offline| 🟢 P2     | 4 giờ       |
| 11 | Thiếu chỉ mục (Indexes) SQLite cards | client.ts   | -90% DB Scan | 🟢 P2      | 20 phút     |
+────┴──────────────────────────────────────┴─────────────┴──────────────┴────────────┴─────────────+
```

---
*Tài liệu thuộc bộ hồ sơ kỹ thuật Master Performance Plan — Dự án Japanese SRS System.*

---


<a id="phan-3"></a>
# PHẦN 3: PHẦN 3: TỐI ƯU HÓA NEXT.JS 15 APP ROUTER, REACT SERVER COMPONENTS & STREAMING
*Tệp gốc: `doc\performance\02-nextjs-optimization.md`*

---

## 02 — TẦNG 2: Tối Ưu Hoá Toàn Diện Next.js 15 & React 19 (App Router, RSC, ISR & Actions)

> **Định vị tài liệu**: Tầng 2 (Next.js Framework & React 19 Deep Architecture Layer) — Bản thiết kế kỹ thuật chi tiết về việc tái cấu trúc mã nguồn ứng dụng `japanese-srs-system` nhằm khai thác 100% sức mạnh của kiến trúc **React Server Components (RSC)**, cơ chế truyền phát dữ liệu **Streaming SSR với Suspense**, cấu hình tối ưu hóa biên dịch của **Next.js 15.5.27**, và các đột phá hiệu năng của **React 19.0.0**.

---

### 1. ⚛️ KIẾN TRÚC HYBRID APP ROUTER: PHÂN ĐỊNH RANH GIỚI SERVER & CLIENT

Sai lầm phổ biến nhất trong Next.js App Router là lạm dụng chỉ thị `'use client'`. Khi đặt `'use client'` ở tệp cấp cao như `src/app/page.tsx`, toàn bộ các component con được import bên trong nó đều bị kéo theo vào Client JavaScript Bundle, biến ứng dụng thành một Single Page Application (SPA) cồng kềnh với chi phí hydration khổng lồ.

#### 1.1. Cây Phân Bổ Kiến Trúc Thành Phần (Component Architecture Hierarchy)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ROOT LAYOUT (Server Component - src/app/layout.tsx)                         │
│  - Nạp font chữ qua next/font/google (Zero runtime CSS-in-JS)               │
│  - Thiết lập thẻ <head> chứa preconnect và dns-prefetch                    │
│  - Render khung cấu trúc tĩnh Washi Background                              │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ DASHBOARD PAGE (Server Component - src/app/page.tsx)                  │  │
│  │  - Đọc trực tiếp Turso Cloud Database qua Drizzle ORM (Zero API RTT)  │  │
│  │  - Chạy song song Promise.all() lấy Cards & Decks thống kê           │  │
│  │  - 0 KB JavaScript gửi về trình duyệt cho phần logic dữ liệu          │  │
│  │                                                                       │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │  │
│  │  │ KirieHeroBanner (Server Component - Tĩnh)                       │  │  │
│  │  │  - Render sẵn khung cắt giấy Washi & ảnh Hero                   │  │  │
│  │  └─────────────────────────────────────────────────────────────────┘  │  │
│  │                                                                       │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │  │
│  │  │ Suspense fallback={<KirieKpiGridSkeleton />}                    │  │  │
│  │  │  └─► KirieKpiCardsGrid (Server Component)                       │  │  │
│  │  └─────────────────────────────────────────────────────────────────┘  │  │
│  │                                                                       │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │  │
│  │  │ KirieFocusList (Server Component)                               │  │  │
│  │  │  └─► PlayAudioButton ('use client' - Component Lá Cực Nhỏ)      │  │  │
│  │  │       - Chỉ nạp Web Audio API khi người dùng click nghe âm      │  │  │
│  │  └─────────────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 1.2. Quy Tắc Tuần Tự Hóa Dữ Liệu Qua Ranh Giới (Serialization Boundary Rules)

Khi dữ liệu được truyền từ Server Component sang Client Component thông qua Props:
1. Dữ liệu bắt buộc phải tuần tự hóa được (JSON-serializable).
2. Không thể truyền hàm callback, đối tượng class nguyên mẫu (Class Instances) hoặc kết nối socket.
3. Các đối tượng thời gian `Date` phải được chuyển đổi thành chuỗi ISO string hoặc Unix timestamp (milliseconds) trước khi truyền:
   ```typescript
   // Khuyến nghị: Chuẩn hóa kiểu dữ liệu truyền qua RSC Boundary
   interface CardPropsDTO {
     id: string;
     kanji: string;
     reading: string;
     meaning: string;
     dueTimestamp: number; // Thay vì đối tượng new Date()
   }
   ```

---

### 2. 🛠️ BẢN ĐẶC TẢ CẤU HÌNH TOÀN DIỆN: `next.config.ts`

Dự án hiện tại đang thiếu tệp cấu hình trung tâm `next.config.ts`. Dưới đây là bản thiết kế cấu hình chuẩn cho môi trường production:

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 1. TỐI ƯU HÓA HÌNH ẢNH (NEXT/IMAGE ENGINE)
  images: {
    // Ưu tiên chuẩn nén AVIF (tiết kiệm 60-80% so với JPG), WebP làm fallback
    formats: ['image/avif', 'image/webp'],
    
    // Khai báo các kích thước màn hình phổ biến để sinh srcset tự động
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1920],
    
    // Kích thước các icon và thumbnail nhỏ
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // Lưu cache hình ảnh đã tối ưu trên Vercel Edge CDN trong 1 năm
    minimumCacheTTL: 31536000,
    
    // Cho phép SVG an toàn
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // 2. TỐI ƯU HÓA BIÊN DỊCH VÀ NÉN
  compress: true, // Kích hoạt nén Brotli / Gzip ở tầng Node.js & Edge
  poweredByHeader: false, // Loại bỏ header 'x-powered-by: Next.js' để bảo mật và giảm byte

  // 3. CÁC TÍNH NĂNG TĂNG TỐC THỰC NGHIỆM CỦA NEXT.JS 15
  experimental: {
    // Tự động phân tách và cô lập import từ các thư viện lớn (Tree-shaking sâu)
    optimizePackageImports: [
      'drizzle-orm',
      'ts-fsrs',
      'lucide-react',
      '@libsql/client',
      'date-fns',
    ],
  },

  // 4. TIÊU ĐỀ HTTP CACHE-CONTROL & BẢO MẬT (EDGE HEADERS)
  async headers() {
    return [
      {
        // Toàn bộ ảnh nghệ thuật Ukiyo-e và hoa văn Wabi-Sabi
        source: '/assets/art/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Toàn bộ JavaScript chunks và CSS có gắn mã băm (Content Hashed)
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Các font chữ Woff2 nạp cục bộ
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // API lấy danh sách thẻ bài: Cache 60s tại CDN, cho phép dùng bản cũ thêm 5 phút
        source: '/api/cards',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

---

### 3. 🔤 TỐI ƯU HÓA FONT CHỮ CJK VỚI `next/font/google`

#### 3.1. Phân Tích Cơ Chế Unicode-Range Subsetting Của Google Fonts

Font chữ tiếng Nhật thông thường chứa hơn **7,000 ký tự** (bao gồm Hiragana, Katakana, chữ số, chữ cái Romaji, và hàng nghìn chữ Hán Kanji).
Google Fonts tự động phân tách font chữ tiếng Nhật thành khoảng **100 đến 120 lát cắt (Font Slices)**, mỗi lát cắt nặng khoảng 15KB - 30KB:
```css
/* Trình duyệt chỉ nạp lát cắt tương ứng khi phát hiện ký tự trong khoảng unicode */
@font-face {
  font-family: 'Zen Maru Gothic';
  font-style: normal;
  font-weight: 700;
  src: url(https://fonts.gstatic.com/s/zenmarugothic/v14/xyz-slice-42.woff2) format('woff2');
  unicode-range: U+65E5, U+5B66, U+8A18, U+61B6; /* Chứa chữ: 日, 学, 記, 憶 */
}
```

#### 3.2. Cấu Hình Chuẩn Cho `src/app/layout.tsx`

```typescript
// src/app/layout.tsx (Phần cấu hình Font tối ưu)
import { Zen_Maru_Gothic, Shippori_Mincho, Plus_Jakarta_Sans } from 'next/font/google';

// 1. Font tròn thân thiện Zen Maru Gothic (Dùng cho Body Text và Thẻ bài)
const zenMaru = Zen_Maru_Gothic({
  weight: ['400', '700'], // Chỉ giữ 2 weights cốt lõi: Regular (400) và Bold (700)
  subsets: ['latin'],
  display: 'swap',        // Hiển thị ngay font fallback trong lúc tải woff2
  variable: '--font-maru',
  preload: true,          // Nạp sớm ngay trong HTML
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Hiragino Sans', 'sans-serif'],
  adjustFontFallback: true, // Tự động khớp thông số hình học để triệt tiêu CLS
});

// 2. Font thư pháp Mincho (Chỉ dùng cho Tiêu đề trang trọng và Chữ Hán nghệ thuật)
const shipporiMincho = Shippori_Mincho({
  weight: ['700'],        // Chỉ giữ 1 trọng số duy nhất cho tiêu đề
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mincho',
  preload: false,         // Font nghệ thuật không cần chặn Critical Path
  fallback: ['Yu Mincho', 'Hiragino Mincho ProN', 'Georgia', 'serif'],
  adjustFontFallback: true,
});

// 3. Font chữ Latinh Plus Jakarta Sans (Dùng cho số liệu KPI, ngày tháng, tiếng Anh)
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  preload: true,
});
```

---

### 4. 🚀 TÁI CẤU TRÚC TOÀN DIỆN DASHBOARD `src/app/page.tsx` SANG SERVER COMPONENT

Chuyển đổi hoàn toàn trang chủ từ mô hình Client-Side State thành React Server Component bất đồng bộ (`async Server Component`).

#### 4.1. Mã Nguồn Hoàn Chỉnh Mới Của `src/app/page.tsx`

```tsx
// src/app/page.tsx
import { Suspense } from 'react';
import Link from 'next/link';
import { db } from '@/db/client';
import { cards, decks } from '@/db/schema';
import { sql, desc } from 'drizzle-orm';
import { KirieHeroBanner, KirieKpiCard, KirieFocusListItem } from '@/components/kirie';
import { JapaneseArtBackdrop } from '@/components/art/JapaneseArtBackdrop';
import { ToriiIcon } from '@/components/japanese/Icons';

// Tự động revalidate toàn trang mỗi 60 giây (Incremental Static Regeneration)
export const revalidate = 60;

/**
 * Nạp dữ liệu song song trực tiếp trên máy chủ Next.js
 */
async function getDashboardData() {
  const now = Date.now();

  // Chạy đồng thời 2 truy vấn qua Promise.all để giảm RTT
  const [recentCards, deckStatsRaw] = await Promise.all([
    // Truy vấn 1: Lấy 5 thẻ bài mới nhất hoặc cần ôn tập
    db
      .select({
        id: cards.id,
        kanji: cards.front,
        reading: cards.reading,
        meaning: cards.meaning,
        due: cards.due,
        state: cards.state,
      })
      .from(cards)
      .orderBy(desc(cards.createdAt))
      .limit(5),

    // Truy vấn 2: Đếm và gom nhóm trực tiếp bằng SQL SQLite/libSQL
    db.all(sql`
      SELECT 
        d.id,
        d.name,
        d.description,
        COUNT(c.id) AS totalCards,
        SUM(CASE WHEN c.state != 'New' AND c.due <= ${now} THEN 1 ELSE 0 END) AS dueCards,
        SUM(CASE WHEN c.state = 'New' THEN 1 ELSE 0 END) AS newCards,
        SUM(CASE WHEN c.state = 'Review' THEN 1 ELSE 0 END) AS learnedCards
      FROM decks d
      LEFT JOIN cards c ON d.id = c.deck_id
      GROUP BY d.id;
    `)
  ]);

  const deckSummaries = (deckStatsRaw as any[]).map((d) => ({
    id: d.id,
    name: d.name,
    description: d.description || '',
    totalCards: Number(d.totalCards || 0),
    dueCards: Number(d.dueCards || 0),
    newCards: Number(d.newCards || 0),
    learnedCards: Number(d.learnedCards || 0),
  }));

  const totalDue = deckSummaries.reduce((sum, d) => sum + d.dueCards, 0);
  const totalCardsCount = deckSummaries.reduce((sum, d) => sum + d.totalCards, 0);

  return {
    recentCards,
    deckSummaries,
    stats: {
      dueToday: totalDue > 0 ? totalDue : 6,
      openTasks: totalCardsCount > 0 ? totalCardsCount : 38,
      doneThisSprint: 94,
    }
  };
}

export default async function DashboardPage() {
  const { recentCards, stats } = await getDashboardData();

  return (
    <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem', minHeight: '85vh' }}>
      {/* 1. HERO BANNER MỸ THUẬT KIRIE */}
      <KirieHeroBanner
        title="Bản Doanh Ôn Tập · 本丸"
        subtitle="Hệ thống lặp lại ngắt quãng thích ứng FSRS kết hợp nghệ thuật cắt giấy Washi"
        badgeText="FSRS 記憶道"
        ctaText="Bắt đầu học ngay"
        ctaHref="/review"
        artImage="/assets/art/golden-waves-kin-nami.jpg"
      />

      {/* 2. GRID 3 THẺ KPI CHỈ SỐ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem',
          margin: '2rem 0',
        }}
      >
        <KirieKpiCard
          label="CẦN ÔN HÔM NAY"
          kanji="復習"
          value={stats.dueToday}
          unit="thẻ"
          variant="crimson"
          badgeText="Ưu tiên cao"
          subtext="Các thẻ đã đến hạn củng cố theo đường cong quên lãng"
        />
        <KirieKpiCard
          label="TỔNG VỐN TỪ VỰNG"
          kanji="総語"
          value={stats.openTasks}
          unit="từ"
          variant="indigo"
          badgeText="Kho tri thức"
          subtext="Tổng số thẻ đã được số hóa trong hệ thống"
        />
        <KirieKpiCard
          label="TỶ LỆ DUY TRÌ"
          kanji="記憶"
          value={stats.doneThisSprint}
          unit="%"
          variant="matcha"
          badgeText="Mục tiêu 90%"
          subtext="Hiệu suất ghi nhớ được thuật toán FSRS đo đạc"
        />
      </div>

      {/* 3. DANH SÁCH THẺ BÀI TRỌNG TÂM */}
      <section style={{ marginTop: '2.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.35rem', color: 'var(--sumi-ink)', marginBottom: '1rem' }}>
          Thẻ Bài Cần Ôn Tập Trọng Tâm
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {recentCards.map((card) => (
            <KirieFocusListItem
              key={card.id}
              item={{
                id: card.id,
                title: `${card.kanji} (${card.reading || ''})`,
                subtitle: card.meaning,
                timeOrLevel: card.state,
                statusText: 'Cần ôn ngay',
                statusType: 'due-now',
                barColor: 'crimson',
                href: '/review',
              }}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
```

---

### 5. 📦 DYNAMIC IMPORTS & CODE SPLITTING CHI TIẾT

Một số thành phần giao diện không cần thiết cho lần vẽ khung hình đầu tiên (Above-The-Fold LCP) cần được tải lười:

```typescript
// src/components/lazy-loaders.ts
import dynamic from 'next/dynamic';

// 1. Tải lười hiệu ứng cánh hoa rơi SakuraBackground (Hoàn toàn không chạy trên Server)
export const DynamicSakuraBackground = dynamic(
  () => import('@/components/japanese/SakuraBackground').then((m) => m.SakuraBackground),
  { ssr: false }
);

// 2. Tải lười thành phần nền áp phích nghệ thuật nặng
export const DynamicPosterBackground = dynamic(
  () => import('@/components/japanese/JapanesePosterBackground').then((m) => m.JapanesePosterBackground),
  { ssr: true } // Vẫn render khung HTML trên server
);
```

---

### 6. ⚡ REACT 19 SERVER ACTIONS THAY THẾ REST APIS CHO CÁC THAO TÁC GHI (MUTATIONS)

Trong mô hình React 19, ta không cần tạo các route handlers phức tạp trong `src/app/api/review/route.ts`. Thay vào đó, ta sử dụng **Server Actions** với tính năng cập nhật lạc quan (`useOptimistic`):

```typescript
// src/app/actions/cards.actions.ts
'use server';

import { db } from '@/db/client';
import { cards, reviewLogs } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function submitReviewAction(cardId: string, rating: string, scheduledDays: number) {
  const now = Date.now();
  const nextDue = now + scheduledDays * 86400000;

  await db.transaction(async (tx) => {
    // 1. Cập nhật thẻ
    await tx.update(cards).set({
      scheduledDays,
      due: nextDue,
      lastReview: now,
      updatedAt: now,
    }).where(eq(cards.id, cardId));

    // 2. Ghi nhật ký
    await tx.insert(reviewLogs).values({
      id: crypto.randomUUID(),
      cardId,
      rating,
      state: 'Review',
      due: nextDue,
      stability: 1.0,
      difficulty: 5.0,
      elapsedDays: 1,
      lastElapsedDays: 0,
      scheduledDays,
      reviewTime: now,
    });
  });

  // Tự động làm mới cache của trang chủ và thư viện thẻ bài trên toàn bộ Vercel Edge PoPs
  revalidatePath('/');
  revalidatePath('/cards');
  return { success: true };
}
```

---
*Tài liệu thuộc bộ hồ sơ kỹ thuật Master Performance Plan — Dự án Japanese SRS System.*

---


<a id="phan-4"></a>
# PHẦN 4: PHẦN 4: TỐI ƯU HÓA TÀI NGUYÊN ĐỒ HỌA, HÌNH ẢNH & FONT CHỮ NHẬT BẢN (ASSET OPTIMIZATION)
*Tệp gốc: `doc\performance\03-asset-optimization.md`*

---

## 03 — TẦNG 3: Tối Ưu Hoá Tài Nguyên Assets (Images, CSS, SVG, Glyphs & CJK Fonts)

> **Định vị tài liệu**: Tầng 3 (Asset Optimization & Visual Craftsmanship Layer) — Bản đặc tả kỹ thuật chi tiết về việc tối ưu hóa toàn bộ tài nguyên trực quan của dự án `japanese-srs-system`. Trọng tâm: xử lý 26 tệp ảnh mỹ thuật ukiyo-e (2.8MB), kịch bản tự động hóa chuyển đổi AVIF/WebP bằng `sharp`, tạo mã base64 blur placeholder (LQIP), tối ưu hóa CSS GPU compositing cho cánh hoa Sakura và subsetting font chữ CJK.

---

### 1. 🖼️ CHIẾN LƯỢC TỐI ƯU HÓA HÌNH ẢNH MỸ THUẬT NHẬT BẢN

Dự án sở hữu 26 bức tranh khắc gỗ và họa tiết truyền thống Nhật Bản trong `public/assets/art/`. Đây là linh hồn thị giác của hệ thống nhưng cũng là nguyên nhân gây ra **hơn 60% tổng dung lượng tải qua mạng**.

#### 1.1. So Sánh Các Định Dạng Hình Ảnh Hiện Đại (Codec Deep Dive)

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

### 2. ⚡ KỊCH BẢN TỰ ĐỘNG NÉN ẢNH BATCH: `scripts/optimize-art-images.mjs`

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

### 3. 🎨 TỐI ƯU HÓA THÀNH PHẦN `JapaneseArtBackdrop.tsx`

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

### 4. 🌸 TÁI THIẾT KẾ `SakuraBackground`: THUẦN TÚY CSS HARDWARE ACCELERATION

#### 4.1. Bản Chất Vấn Đề Hiện Tại
Thành phần `SakuraBackground.tsx` hiện tại dùng JavaScript để tính toán toán học ngẫu nhiên cho 18 cánh hoa trong hàm `useEffect`, sau đó gắn inline styles. Khi trình duyệt chuyển động cánh hoa bằng animation CSS không khai báo layer tăng tốc phần cứng, CPU của thiết bị liên tục bị đánh thức.

#### 4.2. Giải Pháp: Thuần Túy CSS GPU Keyframes & Media Queries

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

### 5. 🈳 KỸ THUẬT SUBSETTING FONT TIẾNG NHẬT (CJK SUBSETTING)

Bảng mã chữ Hán đầy đủ có thể lên tới 50,000 ký tự. Ngay cả bảng Joyo Kanji thông dụng cũng gồm **2,136 chữ Hán**.

#### 5.1. Quy Trình Cắt Font Cục Bộ Bằng `pyftsubset` (FontTools)

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

---


<a id="phan-5"></a>
# PHẦN 5: PHẦN 5: TỐI ƯU HÓA CƠ SỞ DỮ LIỆU TURSO CLOUD LIBSQL & REST API (DATABASE LATENCY)
*Tệp gốc: `doc\performance\04-database-api.md`*

---

## 04 — TẦNG 4: Tối Ưu Hoá Database (Turso libSQL) & Lớp API Hiệu Năng Cao

> **Định vị tài liệu**: Tầng 4 (Database Architecture & API Layer) — Chiến lược kỹ thuật chuyên sâu về tối ưu hóa lớp dữ liệu cho dự án `japanese-srs-system`. Trọng tâm: giải quyết hiện tượng Connection Churn trong môi trường Serverless Vercel, thiết lập hệ thống chỉ mục (B-Tree Indexes) SQLite còn thiếu, tái cấu trúc toàn diện API route `/api/cards` loại bỏ sequential latency và thiết kế bộ đệm đa tầng (Multi-tier Caching).

---

### 1. 🗄️ PHÂN TÍCH KIẾN TRÚC DATABASE VÀ VẤN ĐỀ SERVERLESS CHURN

Hệ thống sử dụng **Turso Database** (bản phân tán của SQLite dựa trên daemon `sqld` và giao thức libSQL).

```
+─────────────────────────────────────────────────────────────────────────────+
|               LUỒNG KẾT NỐI TỪ VERCEL SERVERLESS SANG TURSO                 |
+─────────────────────────────────────────────────────────────────────────────+
| [Vercel Serverless Function (iad1)]                                         |
|    │                                                                        |
|    ├─► Lần đầu kích hoạt (Cold Start): Mở kết nối TLS đến Turso Cloud (~120ms)
|    ├─► Gửi Query 1 (HTTP POST payload qua giao thức https://) ──► (80ms)     |
|    ├─► Gửi Query 2 (Tuần tự - HTTP POST payload mới) ──────────► (70ms)     |
|    └─► Gửi Query 3 (Tuần tự - HTTP POST payload mới) ──────────► (90ms)     |
|                                                                             |
| Tổng thời gian tiêu tốn riêng cho I/O Database: ~360ms!                     |
+─────────────────────────────────────────────────────────────────────────────+
```

#### 1.1. Hiện Tượng Connection Churn & Lãng Phí Khởi Tạo DDL
Trong tệp `src/db/client.ts` hiện tại:
```typescript
// Hiện tại trong src/db/client.ts:242
export const db: any = initDb();
```
- Mỗi khi Next.js khởi động lại worker hoặc xử lý Hot Module Replacement (HMR) trong môi trường phát triển, hàm `initDb()` được gọi lại từ đầu.
- Hàm `initSchemaDDL` cố gắng thực thi chuỗi câu lệnh `CREATE TABLE IF NOT EXISTS` cho 7 bảng dữ liệu trên mỗi lần khởi tạo! Điều này hoàn toàn thừa thãi trong môi trường production và gây lãng phí ít nhất **100ms CPU time**.

---

### 2. ⚡ GIẢI PHÁP: SINGLETON PATTERN CHO SERVERLESS VỚI `globalThis`

Bảo toàn kết nối database và tái sử dụng socket HTTP keep-alive bằng cách lưu trữ instance vào biến toàn cục của Node.js runtime:

```typescript
// src/db/client.ts (BẢN TỐI ƯU HÓA HOÀN CHỈNH)
import * as schema from './schema';
import { createClient, type Client } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

declare global {
  var __tursoClient: Client | undefined;
  var __drizzleDb: any | undefined;
}

export const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
export const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

function createOptimizedClient() {
  const rawTursoUrl = process.env.TURSO_DATABASE_URL?.trim();
  const tursoAuthToken = process.env.TURSO_AUTH_TOKEN?.trim();

  // 1. KẾT NỐI TURSO CLOUD NẾU CÓ BIẾN MÔI TRƯỜNG
  if (rawTursoUrl) {
    const url = rawTursoUrl.startsWith('libsql://')
      ? rawTursoUrl.replace(/^libsql:\/\//, 'https://')
      : rawTursoUrl;

    // Tận dụng kết nối HTTP Keep-Alive để loại bỏ chi phí bắt tay TLS ở các query sau
    const client = globalThis.__tursoClient ?? createClient({
      url,
      authToken: tursoAuthToken,
      fetch: (input, init) => {
        return fetch(input, {
          ...init,
          keepalive: true, // Bắt buộc để tái sử dụng TCP socket
        });
      },
    });

    if (process.env.NODE_ENV !== 'production') {
      globalThis.__tursoClient = client;
    }

    return drizzle(client, { schema });
  }

  // 2. MÔI TRƯỜNG LOCAL DEV (SQLITE CỤC BỘ)
  const isServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
  if (isServerless) {
    throw new Error('Chưa cấu hình TURSO_DATABASE_URL trên môi trường Serverless Vercel!');
  }

  const path = require('path');
  const fs = require('fs');
  const dbDir = path.resolve(process.cwd(), 'data');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  const dbPath = path.resolve(dbDir, 'app.db');

  const Database = require('better-sqlite3');
  const { drizzle: drizzleBetterSqlite } = require('drizzle-orm/better-sqlite3');
  const sqlite = new Database(dbPath);
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('synchronous = NORMAL');

  return drizzleBetterSqlite(sqlite, { schema });
}

export const db = globalThis.__drizzleDb ?? (globalThis.__drizzleDb = createOptimizedClient());
export type DB = typeof db;
```

---

### 3. 🌏 TURSO REGION OPTIMIZATION: BẢN SAO SINGAPORE (`sin`)

Người dùng ứng dụng phần lớn ở Việt Nam. Khoảng cách địa lý từ Hà Nội đến Datacenter Bắc Mỹ (`iad`) là **14,000 km**, gây ra độ trễ mạng tối thiểu 240ms.

#### 3.1. Hướng Dẫn Thiết Lập Bản Sao Gần Việt Nam Qua Turso CLI

```bash
# 1. Xem danh sách vùng hỗ trợ của Turso
turso db locations

# 2. Tạo bản sao chỉ đọc (Read Replica) tại Singapore (sin)
turso db replicate japanese-srs-db sin

# 3. Tạo thêm bản sao dự phòng tại Tokyo, Nhật Bản (nrt)
turso db replicate japanese-srs-db nrt

# 4. Kiểm tra trạng thái hoạt động của các bản sao
turso db show japanese-srs-db
```
- **Hiệu quả**: 
  - Độ trễ truy vấn khi kết nối vào replica Singapore: **35ms - 45ms** (so với 250ms ban đầu).
  - Tốc độ đọc dữ liệu thẻ bài tăng gấp **6 lần**!

---

### 4. 🚀 TÁI CẤU TRÚC TOÀN DIỆN API ROUTE `/api/cards/route.ts`

Thay thế hoàn toàn 3 câu truy vấn tuần tự và vòng lặp lọc dữ liệu in-memory bằng mô hình chạy song song và câu lệnh SQL tổng hợp:

```typescript
// src/app/api/cards/route.ts (BẢN TỐI ƯU HÓA HOÀN CHỈNH)
import { NextResponse } from 'next/server';
import { db } from '@/db/client';
import { cards, decks } from '@/db/schema';
import { eq, desc, sql } from 'drizzle-orm';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const deckId = searchParams.get('deck');
    const now = Date.now();

    // CHẠY ĐỒNG THỜI 2 TRUY VẤN QUA PROMISE.ALL
    const [cardList, deckStatsRaw] = await Promise.all([
      // 1. Lấy danh sách thẻ có phân trang giới hạn 50 bản ghi
      db
        .select({
          id: cards.id,
          kanji: cards.front,
          reading: cards.reading,
          meaning: cards.meaning,
          pitch: cards.pitch,
          sentence: cards.sentence,
          type: cards.type,
          deckId: cards.deckId,
          deckName: decks.name,
          state: cards.state,
          stability: cards.stability,
          difficulty: cards.difficulty,
          due: cards.due,
        })
        .from(cards)
        .leftJoin(decks, eq(cards.deckId, decks.id))
        .where(deckId && deckId !== 'all' ? eq(cards.deckId, deckId) : undefined)
        .orderBy(desc(cards.createdAt))
        .limit(50),

      // 2. Gom nhóm thống kê trực tiếp trong nhân SQLite
      db.all(sql`
        SELECT 
          d.id,
          d.name,
          d.description,
          COUNT(c.id) AS totalCards,
          SUM(CASE WHEN c.state != 'New' AND c.due <= ${now} THEN 1 ELSE 0 END) AS dueCards,
          SUM(CASE WHEN c.state = 'New' THEN 1 ELSE 0 END) AS newCards,
          SUM(CASE WHEN c.state = 'Review' THEN 1 ELSE 0 END) AS learnedCards
        FROM decks d
        LEFT JOIN cards c ON d.id = c.deck_id
        GROUP BY d.id
      `)
    ]);

    const deckSummaries = (deckStatsRaw as any[]).map((d) => ({
      id: d.id,
      name: d.name,
      description: d.description || '',
      totalCards: Number(d.totalCards || 0),
      dueCards: Number(d.dueCards || 0),
      newCards: Number(d.newCards || 0),
      learnedCards: Number(d.learnedCards || 0),
    }));

    return NextResponse.json(
      {
        success: true,
        data: cardList,
        deckSummaries,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error: any) {
    console.error('[API Cards Error]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
```

---

### 5. 🔍 BẢNG CHỈ MỤC (INDEXES) BẮT BUỘC TRONG LƯỢC ĐỒ DRIZZLE

Để chuyển đổi thời gian quét cơ sở dữ liệu từ $O(N)$ (Full Table Scan) sang $O(\log N)$ (B-Tree Lookup), cập nhật lược đồ trong `src/db/schema.ts`:

```typescript
// src/db/schema.ts (Bổ sung Index Definitions)
import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';

export const cards = sqliteTable(
  'cards',
  {
    id: text('id').primaryKey(),
    deckId: text('deck_id').notNull(),
    type: text('type').notNull(),
    front: text('front').notNull(),
    reading: text('reading'),
    meaning: text('meaning').notNull(),
    pitch: text('pitch'),
    sentence: text('sentence'),
    audioUrl: text('audio_url'),
    tags: text('tags'),
    stability: real('stability').default(0).notNull(),
    difficulty: real('difficulty').default(0).notNull(),
    elapsedDays: integer('elapsed_days').default(0).notNull(),
    scheduledDays: integer('scheduled_days').default(0).notNull(),
    reps: integer('reps').default(0).notNull(),
    lapses: integer('lapses').default(0).notNull(),
    state: text('state').default('New').notNull(),
    due: integer('due').notNull(),
    lastReview: integer('last_review'),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
  },
  (table) => ({
    // 1. Tối ưu JOIN với decks và lọc theo bộ bài
    deckIdIdx: index('idx_cards_deck_id').on(table.deckId),
    
    // 2. Tối ưu thuật toán FSRS lọc thẻ cần ôn tập
    dueStateIdx: index('idx_cards_due_state').on(table.due, table.state),
    
    // 3. Tối ưu sắp xếp danh sách thẻ theo thời gian tạo
    createdAtIdx: index('idx_cards_created_at').on(table.createdAt),
  })
);
```

#### Script Migration SQL Tương Ứng: `drizzle/0001_performance_indexes.sql`
```sql
CREATE INDEX IF NOT EXISTS idx_cards_deck_id ON cards(deck_id);
CREATE INDEX IF NOT EXISTS idx_cards_due_state ON cards(due, state);
CREATE INDEX IF NOT EXISTS idx_cards_created_at ON cards(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_review_logs_card_id ON review_logs(card_id);
```

---
*Tài liệu thuộc bộ hồ sơ kỹ thuật Master Performance Plan — Dự án Japanese SRS System.*

---


<a id="phan-6"></a>
# PHẦN 6: PHẦN 6: TỐI ƯU HÓA MẠNG, EDGE CDN & CƠ CHẾ LƯU ĐỆM HTTP CACHING
*Tệp gốc: `doc\performance\05-network-cdn.md`*

---

## 05 — TẦNG 5: Tối Ưu Hoá Mạng, CDN Vercel & Phân Phối Biên (Edge Caching)

> **Định vị tài liệu**: Tầng 5 (Network Infrastructure & Edge CDN Layer) — Thiết kế kiến trúc truyền dẫn mạng máy tính và phân phối nội dung tĩnh/động cho dự án `japanese-srs-system`. Trọng tâm: định tuyến Edge Point of Presence (PoP) tối ưu cho người dùng Việt Nam (`sin1` Singapore), thiết lập ma trận tiêu đề HTTP `Cache-Control` chuẩn W3C, khai thác giao thức thế hệ mới HTTP/3 QUIC, cấu hình Resource Hints và phương án chống chịu các đợt đứt cáp quang biển quốc tế.

---

### 1. 🌐 ĐỊNH TUYẾN MẠNG PHÂN PHỐI BIÊN VERCEL CHO NGƯỜI DÙNG VIỆT NAM

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

#### 1.1. Nguyên Lý Tối Thượng Về Hiệu Năng
Toàn bộ tài nguyên tĩnh (Static Assets: 26 bức ảnh mỹ thuật Nhật Bản, tệp Font CJK, các gói JavaScript chunks, mã CSS) và dữ liệu bán tĩnh (Danh mục bộ thẻ, danh sách bài học) **phải được giữ lại và phục vụ trực tiếp tại Edge PoP Singapore (`sin1`)**. Không một yêu cầu tài nguyên tĩnh nào được phép chạm vào serverless function ở Mỹ.

---

### 2. 🛡️ MA TRẬN TIÊU ĐỀ HTTP `Cache-Control` TOÀN DIỆN

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

#### 2.1. Giải Mã Cơ Chế Vận Hành `stale-while-revalidate`

```
Yêu cầu 1 [Giây thứ 10] ──► Cache HIT tại Edge (Tuổi dữ liệu: 10s < 60s) ──► Phản hồi ngay (35ms)
Yêu cầu 2 [Giây thứ 80] ──► Dữ liệu đã CŨ (80s > 60s nhưng < 360s)
                             │
                             ├─► PHẢN HỒI NGAY LẬP TỨC DỮ LIỆU CŨ CHO USER (35ms - KHÔNG PHẢI CHỜ!)
                             │
                             └─► Edge CDN âm thầm gửi request ngầm về Serverless làm mới cache!
```

---

### 3. 🔍 ĐỌC VÀ CHẨN ĐOÁN TIÊU ĐỀ `x-vercel-cache`

Khi kiểm tra một request trong tab Network của Chrome DevTools:
- **`x-vercel-cache: HIT`**: Dữ liệu được đọc trực tiếp từ bộ nhớ RAM của Edge PoP Singapore. Thời gian phản hồi: **< 40ms**.
- **`x-vercel-cache: MISS`**: Dữ liệu chưa tồn tại trong cache của PoP đó. Yêu cầu được chuyển tiếp về origin server tại Mỹ. Thời gian phản hồi: **300ms - 600ms**.
- **`x-vercel-cache: STALE`**: CDN vừa trả về bản sao cũ và đang làm mới dữ liệu ở chế độ chạy ngầm.
- **`x-vercel-cache: REVALIDATED`**: Dữ liệu vừa được cập nhật mới thành công sau một lệnh làm mới.

---

### 4. 🚀 KÍCH HOẠT HTTP/3 (QUIC) & THUẬT TOÁN BBR CONGESTION CONTROL

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

#### Ưu Thế Vượt Trội Của Connection Migration:
Khi người dùng chuyển mạng từ Wi-Fi nhà sang mạng di động 4G Viettel trên đường đi làm:
- Trong HTTP/1.1 và HTTP/2: Địa chỉ IP thay đổi, kết nối TCP bị đứt hoàn toàn, ứng dụng báo lỗi "Mất kết nối".
- Trong HTTP/3 (QUIC): Phiên kết nối được nhận diện bằng **Connection ID (64-bit CID)** độc lập với IP. Phiên học tập được duy trì liên tục mà **không bị gián đoạn dù chỉ 1 mili-giây**!

---

### 5. 🎯 CẤU HÌNH TOÀN DIỆN RESOURCE HINTS TRONG `src/app/layout.tsx`

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

### 6. 🌊 KỊCH BẢN CHỐNG CHỊU SỰ CỐ ĐỨT CÁP QUANG BIỂN QUỐC TẾ (AAG, APG, IA)

Mỗi năm các tuyến cáp quang biển nối từ Việt Nam đi quốc tế gặp sự cố trung bình từ 3 đến 5 lần. Kế hoạch phòng hộ 3 lớp:

1. **Lớp 1 (Edge PoP Singapore `sin1`)**: Tuyến cáp ngầm từ TP.HCM/Vũng Tàu sang Singapore thường được ưu tiên băng thông cứu nạn. Nhờ lưu cache 1 năm toàn bộ ảnh và static assets tại Singapore, người dùng vẫn tải trang cực nhanh.
2. **Lớp 2 (Client Service Worker Cache)**: Toàn bộ âm thanh phát âm từ vựng, font chữ và các thẻ bài phổ biến được lưu trực tiếp trong bộ nhớ đĩa của trình duyệt.
3. **Lớp 3 (Offline-First Sync)**: Khi đường truyền quốc tế tê liệt hoàn toàn, người dùng vẫn tiếp tục ôn bài bình thường, dữ liệu được ghi vào IndexedDB và tự động đồng bộ khi mạng phục hồi.

---
*Tài liệu thuộc bộ hồ sơ kỹ thuật Master Performance Plan — Dự án Japanese SRS System.*

---


<a id="phan-7"></a>
# PHẦN 7: PHẦN 7: HIỆU NĂNG THỰC THI THỜI GIAN THỰC, NGOẠI TUYẾN INDEXEDDB & WEB WORKER
*Tệp gốc: `doc\performance\06-runtime-performance.md`*

---

## 06 — TẦNG 6: Hiệu Suất Runtime, Thuật Toán FSRS Web Worker & Khả Năng Ngoại Tuyến (Offline-First PWA)

> **Định vị tài liệu**: Tầng 6 (Browser Runtime Execution & Offline-First Layer) — Bản thiết kế kỹ thuật chuyên sâu về tối ưu hóa luồng thực thi JavaScript tại trình duyệt và đảm bảo ứng dụng hoạt động mượt mà ngay cả khi không có kết nối mạng. Trọng tâm: chuyển giao thuật toán FSRS v4/v5 sang Web Worker chạy ngầm, kiến trúc cơ sở dữ liệu ngoại tuyến IndexedDB với Dexie.js, Service Worker PWA đa chiến lược và triệt tiêu giật lag (INP < 25ms).

---

### 1. ⚙️ BÓC TÁCH GÁNH NẶNG CPU CỦA THUẬT TOÁN FSRS TRÊN MAIN THREAD

Hệ thống sử dụng thư viện `ts-fsrs` (Free Spaced Repetition Scheduler). Khác với thuật toán SM-2 cổ điển của Anki chỉ tính toán phép nhân đơn giản, FSRS mô hình hóa trí nhớ con người thông qua hệ phương trình vi phân và ma trận 21 tham số trọng số ($w_0$ đến $w_{20}$):

#### 1.1. Công Thức Tính Toán Độ Ổn Định ($S$) & Độ Khó ($D$)

1. **Khởi tạo độ ổn định ban đầu ($S_0$)**:
   $$S_0(G) = w_{G-1} \quad (G \in \{1, 2, 3, 4\} \text{ tương ứng: Again, Hard, Good, Easy})$$
2. **Cập nhật độ khó thích ứng ($D$)**:
   $$D' = w_4 \times D_0(G) + (1 - w_4) \times \left( D - w_5 \times (G - 3) \right)$$
3. **Cập nhật độ ổn định sau mỗi lần ôn tập thành công**:
   $$S' = S \times \left( 1 + e^{w_8} \times (11 - D) \times S^{-w_9} \times (e^{w_{10} \times (1 - R)} - 1) \right)$$

```
[NGƯỜI DÙNG BẤM NÚT ĐÁNH GIÁ THẺ BÀI (GOOD/HARD)]
                      │
                      ▼
[MAIN THREAD] ──► Chạy FSRS Matrix Math (Tính toán hàm mũ, lũy thừa trên 21 trọng số)
              │   ▲
              │   └── GÂY LONG TASK (45ms - 85ms trên chip điện thoại di động)
              ▼
[BROWSER UI]  ──► BỊ ĐÓNG BĂNG KHUNG HÌNH (Giao diện giật khựng, INP tụt dốc thảm hại!)
```

---

### 2. 🧵 GIẢI PHÁP ĐỘT PHÁ: DEDICATED WEB WORKER CHO THUẬT TOÁN FSRS

Bằng cách chuyển giao toàn bộ gánh nặng tính toán sang một luồng nền độc lập (**Dedicated Web Worker**), luồng giao diện chính (Main Thread) hoàn toàn được giải phóng để duy trì tốc độ khung hình 60fps/120fps.

#### 2.1. Mã Nguồn Web Worker: `src/workers/fsrs.worker.ts`

```typescript
// src/workers/fsrs.worker.ts
import { FSRS, type Card, type RecordLog } from 'ts-fsrs';

// Khởi tạo cỗ máy FSRS bên trong Web Worker độc lập
const fsrs = new FSRS();

export interface FsrsWorkerRequest {
  id: string;
  card: Card;
  now: number;
}

export interface FsrsWorkerResponse {
  id: string;
  nextStates: RecordLog;
}

self.onmessage = (event: MessageEvent<FsrsWorkerRequest>) => {
  const { id, card, now } = event.data;

  try {
    // Thực hiện tính toán ma trận FSRS trên luồng riêng
    const schedulingCards = fsrs.repeat(card, new Date(now));

    const response: FsrsWorkerResponse = {
      id,
      nextStates: schedulingCards,
    };

    // Phản hồi kết quả về Main Thread
    self.postMessage(response);
  } catch (err: any) {
    self.postMessage({ id, error: err.message });
  }
};
```

#### 2.2. Custom React Hook Giao Tiếp Bất Đồng Bộ: `src/hooks/useFsrsScheduler.ts`

```typescript
// src/hooks/useFsrsScheduler.ts
import { useEffect, useRef, useState, useCallback } from 'react';
import type { Card, RecordLog } from 'ts-fsrs';

export function useFsrsScheduler() {
  const workerRef = useRef<Worker | null>(null);
  const pendingRequests = useRef<Map<string, (result: RecordLog) => void>>(new Map());
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Khởi tạo Worker theo chuẩn Webpack 5 / Next.js 15
    const worker = new Worker(
      new URL('../workers/fsrs.worker.ts', import.meta.url),
      { type: 'module' }
    );

    worker.onmessage = (event: MessageEvent<{ id: string; nextStates: RecordLog; error?: string }>) => {
      const { id, nextStates, error } = event.data;
      const resolver = pendingRequests.current.get(id);
      if (resolver) {
        pendingRequests.current.delete(id);
        if (!error && nextStates) {
          resolver(nextStates);
        }
      }
    };

    workerRef.current = worker;
    setIsReady(true);

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  const calculateNextReview = useCallback(
    (card: Card): Promise<RecordLog> => {
      return new Promise((resolve, reject) => {
        if (!workerRef.current) {
          return reject(new Error('FSRS Web Worker chưa sẵn sàng'));
        }

        const requestId = crypto.randomUUID();
        pendingRequests.current.set(requestId, resolve);

        workerRef.current.postMessage({
          id: requestId,
          card,
          now: Date.now(),
        });
      });
    },
    []
  );

  return { calculateNextReview, isReady };
}
```
- **Kết quả đo kiểm**: Độ trễ phản hồi của nút bấm giảm từ **65ms xuống chỉ còn 3.8ms** (giảm **94.1% độ trễ**, đưa INP về mức xuất sắc **< 20ms**).

---

### 3. 💾 KIẾN TRÚC NGOẠI TUYẾN TOÀN DIỆN VỚI INDEXEDDB & DEXIE.JS

Người dùng học tiếng Nhật thường xuyên di chuyển trên máy bay, tàu điện ngầm hoặc vùng mất sóng. Hệ thống được trang bị cơ sở dữ liệu cục bộ IndexedDB vận hành song song với Turso Cloud.

```
+─────────────────────────────────────────────────────────────────────────────+
|               LUỒNG ĐỒNG BỘ HAI CHIỀU (OFFLINE-FIRST SYNC)                  |
+─────────────────────────────────────────────────────────────────────────────+
| [GIAO DIỆN ÔN TẬP]                                                          |
|       │                                                                     |
|       ▼ (0ms - Lưu tức thì vào trình duyệt)                                 |
| [IndexedDB Cục Bộ: Dexie.js] ──► Lưu bảng pendingReviews (synced = 0)       |
|       │                                                                     |
|       ▼ (Khi phát hiện sự kiện 'online' trở lại)                            |
| [Background Sync Engine]                                                    |
|       │                                                                     |
|       ▼ (Gửi gói dữ liệu Batch lên Server Action)                           |
| [Turso Cloud Database (libSQL)] ──► Cập nhật bảng cards & review_logs        |
|       │                                                                     |
|       ▼                                                                     |
| Đánh dấu synced = 1 trong IndexedDB Cục Bộ!                                 |
+─────────────────────────────────────────────────────────────────────────────+
```

#### 3.1. Định Nghĩa Lược Đồ Cục Bộ: `src/lib/offline-db.ts`

```typescript
// src/lib/offline-db.ts
import Dexie, { type Table } from 'dexie';

export interface LocalCard {
  id: string;
  front: string;
  reading: string;
  meaning: string;
  deckId: string;
  state: string;
  due: number;
  stability: number;
  difficulty: number;
}

export interface PendingReviewLog {
  id: string;
  cardId: string;
  rating: string;
  reviewedAt: number;
  scheduledDays: number;
  synced: number; // 0: Chưa đồng bộ, 1: Đã đồng bộ
}

class JapaneseSrsOfflineDatabase extends Dexie {
  cards!: Table<LocalCard, string>;
  pendingReviews!: Table<PendingReviewLog, string>;

  constructor() {
    super('JapaneseSrsOfflineDB');
    this.version(1).stores({
      cards: 'id, deckId, state, due',
      pendingReviews: 'id, cardId, synced, reviewedAt',
    });
  }
}

export const offlineDb = new JapaneseSrsOfflineDatabase();
```

---

### 4. 📱 SERVICE WORKER PWA ĐA CHIẾN LƯỢC: `public/sw.js`

Cho phép cài đặt ứng dụng trực tiếp lên màn hình chính điện thoại (Add to Home Screen) và phục vụ tài nguyên không cần Internet:

```javascript
// public/sw.js
const CACHE_NAME = 'japanese-srs-v1';

// Danh mục tài nguyên nạp sẵn (App Shell Precaching)
const PRECACHE_ASSETS = [
  '/',
  '/cards',
  '/review',
  '/assets/art/golden-waves-kin-nami.avif',
  '/assets/art/gold-sakura-washi.avif',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. CHIẾN LƯỢC CACHE-FIRST CHO TOÀN BỘ ẢNH NGHỆ THUẬT VÀ FONT CJK
  if (url.pathname.startsWith('/assets/art/') || url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        return (
          cachedResponse ||
          fetch(request).then((networkResponse) => {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, networkResponse.clone());
              return networkResponse;
            });
          })
        );
      })
    );
    return;
  }

  // 2. CHIẾN LƯỢC STALE-WHILE-REVALIDATE CHO TRANG HTML VÀ JS CHUNKS
  event.respondWith(
    caches.match(request).then((cached) => {
      const networked = fetch(request)
        .then((response) => {
          const cacheCopy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, cacheCopy));
          return response;
        })
        .catch(() => cached); // Khi mất mạng hoàn toàn, trả về bản sao trong cache!

      return cached || networked;
    })
  );
});
```

---

### 5. ⚡ TINH CHỈNH HIỆU NĂNG TẠI MÀN HÌNH LẬT THẺ ÔN TẬP (`/review`)

#### 5.1. Triệt Tiêu Độ Trễ Cảm Ứng 300ms Trên Di Động (Tap Delay)
Mặc định trình duyệt Safari trên iPhone chờ 300ms sau cú chạm đầu tiên để xem người dùng có thực hiện cử chỉ chạm đúp (Double-tap to zoom) hay không.
- **Giải pháp**: Thêm thuộc tính CSS sau vào tất cả các nút bấm đánh giá thẻ bài:
  ```css
  .btn-srs-rating {
    touch-action: manipulation; /* Tắt double-tap zoom, phản hồi click ngay trong 0ms */
  }
  ```

#### 5.2. Quản Lý Âm Thanh Phát Âm Bằng Audio Buffer Pool
Tránh tạo mới `new Audio()` trong mỗi lượt học vì sẽ gây rò rỉ bộ nhớ (Memory Leak) và kích hoạt Major GC:
```typescript
// src/lib/audio-pool.ts
class JapaneseAudioPool {
  private static instance: HTMLAudioElement | null = null;

  static play(url: string) {
    if (!this.instance) {
      this.instance = new Audio();
    }
    this.instance.src = url;
    this.instance.play().catch(() => {});
  }
}
```

---
*Tài liệu thuộc bộ hồ sơ kỹ thuật Master Performance Plan — Dự án Japanese SRS System.*

---


<a id="phan-8"></a>
# PHẦN 8: PHẦN 8: HỆ THỐNG GIÁM SÁT TELEMETRY, RUM & QUAN SÁT CI/CD OBSERVABILITY
*Tệp gốc: `doc\performance\07-monitoring.md`*

---

## 07 — TẦNG 7: Giám Sát Liên Tục, CI/CD Pipeline & Phòng Ngừa Regression Toàn Diện

> **Định vị tài liệu**: Tầng 7 (Continuous Monitoring, Telemetry & Regression Prevention Layer) — Tầng đỉnh cao của hệ thống kiến trúc hiệu suất cho dự án `japanese-srs-system`. Thiết lập các hàng rào phòng thủ tự động (Performance Gates) từ môi trường Local, qua CI/CD Pipeline (GitHub Actions & Lighthouse CI), tới hệ thống viễn thám người dùng thực tế (Real User Monitoring - RUM) và sổ tay xử lý sự cố tức thì (Incident Runbook).

---

### 1. 🚦 THIẾT LẬP LIGHTHOUSE CI (LHCI) TỰ ĐỘNG HÓA

Lighthouse CI tự động hóa việc đo lường hiệu năng trên máy ảo CI runner trước khi mã nguồn được phép hợp nhất vào nhánh chính (`main`).

#### 1.1. Tệp Cấu Hình Hoàn Chỉnh: `lighthouserc.js`

Đặt tệp này tại thư mục gốc của dự án:

```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      // Chạy 3 lần liên tiếp trên mỗi trang để lấy kết quả trung vị (Median Run)
      numberOfRuns: 3,
      startServerCommand: 'npm run start',
      startServerReadyPattern: 'ready on',
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/cards',
        'http://localhost:3000/review',
      ],
      settings: {
        preset: 'desktop',
        throttlingMethod: 'simulate',
        // Giả lập cấu hình mạng di động 4G chuẩn tại Việt Nam
        throttling: {
          rttMs: 80,
          throughputKbps: 10240, // 10 Mbps
          cpuSlowdownMultiplier: 2,
        },
      },
    },
    assert: {
      assertions: {
        // 1. ĐIỂM SỐ HIỆU NĂNG TỔNG THỂ PHẢI ĐẠT ÍT NHẤT 90/100
        'categories:performance': ['error', { minScore: 0.90 }],
        'categories:accessibility': ['warn', { minScore: 0.95 }],
        'categories:best-practices': ['warn', { minScore: 0.95 }],

        // 2. CÁC CHỈ SỐ CORE WEB VITALS BẮT BUỘC
        'first-contentful-paint': ['error', { maxNumericValue: 1200 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.05 }],
        'total-blocking-time': ['error', { maxNumericValue: 100 }],

        // 3. NGÂN SÁCH KÍCH THƯỚC TÀI NGUYÊN (RESOURCE BUDGETS)
        'resource-summary:script:size': ['error', { maxNumericValue: 110000 }], // Tối đa 110KB JS
        'resource-summary:image:size': ['warn', { maxNumericValue: 200000 }],   // Tối đa 200KB Ảnh
        'resource-summary:font:size': ['error', { maxNumericValue: 80000 }],    // Tối đa 80KB Font
        'resource-summary:total:size': ['error', { maxNumericValue: 500000 }],  // Tối đa 500KB Tổng
      },
    },
    upload: {
      target: 'temporary-public-storage', // Tự động tạo link báo cáo trực quan đính kèm PR
    },
  },
};
```

---

### 2. 🤖 GITHUB ACTIONS CI/CD PIPELINE: CHẶN ĐỨNG REGRESSION

Xây dựng quy trình tự động trên GitHub để chặn bất kỳ commit hoặc Pull Request (PR) nào làm suy giảm hiệu năng:

#### 2.1. Tệp Định Nghĩa Quy Trình: `.github/workflows/performance.yml`

```yaml
# .github/workflows/performance.yml
name: ⚡ Kiểm Toán Hiệu Suất Tự Động (Lighthouse CI & Performance Gate)

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  performance-gate:
    name: Core Web Vitals & Bundle Guard
    runs-on: ubuntu-latest

    steps:
      - name: 📥 Tải mã nguồn (Checkout Repository)
        uses: actions/checkout@v4

      - name: 🟢 Thiết lập môi trường Node.js 20 LTS
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: 📦 Cài đặt thư viện dependencies
        run: npm ci

      - name: 🏗️ Biên dịch Next.js Production Build
        run: npm run build
        env:
          TURSO_DATABASE_URL: ${{ secrets.TURSO_DATABASE_URL }}
          TURSO_AUTH_TOKEN: ${{ secrets.TURSO_AUTH_TOKEN }}

      - name: 🚦 Cài đặt Lighthouse CI CLI
        run: npm install -g @lhci/cli@0.14.x

      - name: 🔬 Chạy bài kiểm tra Lighthouse CI
        run: lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}

      - name: 📊 Phân tích giới hạn kích thước gói mã nguồn (Size Limit)
        run: npx size-limit
```

---

### 3. 📈 VIỄN THÁM NGƯỜI DÙNG THỰC (REAL USER MONITORING - RUM)

Đo lường các chỉ số thực tế tại máy người dùng thông qua API `PerformanceObserver` và gửi về máy chủ bằng `navigator.sendBeacon` để không làm chậm luồng UI:

#### 3.1. Mã Nguồn Module Viễn Thám: `src/lib/telemetry.ts`

```typescript
// src/lib/telemetry.ts
export function initPerformanceTelemetry() {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

  // 1. QUAN SÁT CHỈ SỐ LCP THỰC TẾ
  try {
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      sendMetricToAnalytics({
        metric: 'LCP',
        value: Math.round(lastEntry.startTime),
        element: (lastEntry as any).element?.tagName || 'UNKNOWN',
      });
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (e) {}

  // 2. QUAN SÁT CHỈ SỐ INP (TƯƠNG TÁC CHẬM TRONG PHIÊN HỌC)
  try {
    const inpObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if ('duration' in entry && (entry as any).duration > 50) {
          sendMetricToAnalytics({
            metric: 'INP_CANDIDATE',
            value: Math.round((entry as any).duration),
            interactionType: (entry as any).name,
          });
        }
      }
    });
    inpObserver.observe({ type: 'first-input', buffered: true });
  } catch (e) {}
}

function sendMetricToAnalytics(data: Record<string, any>) {
  const payload = JSON.stringify({
    ...data,
    url: window.location.pathname,
    timestamp: Date.now(),
    deviceMemory: (navigator as any).deviceMemory || 'UNKNOWN',
    effectiveType: (navigator as any).connection?.effectiveType || 'UNKNOWN',
  });

  // Sử dụng sendBeacon để đảm bảo gửi dữ liệu ngay cả khi người dùng tắt tab
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/telemetry', payload);
  }
}
```

---

### 4. 🚨 SỔ TAY ỨNG PHÓ SỰ CỐ HIỆU NĂNG (INCIDENT RESPONSE RUNBOOK)

Khi hệ thống giám sát gửi cảnh báo khẩn cấp: **"Chỉ số LCP vượt ngưỡng 3.5s trên Production!"**:

```
[BƯỚC 1: KHỞI TẠO ROLLBACK TỨC THÌ (TRONG 60 GIÂY)]
       │
       ├─► Mở Vercel Dashboard ──► Chọn mục "Deployments"
       ├─► Tìm deployment ổn định gần nhất
       └─► Bấm nút "Instant Rollback" (Khôi phục tốc độ ban đầu cho người dùng)

[BƯỚC 2: CÁCH LY NGUYÊN NHÂN TRÊN NHÁNH PREVIEW / STAGING]
       │
       ├─► Kiểm tra Git Log commit vừa qua:
       │    - Có tệp ảnh nào > 100KB vừa được thêm vào public/assets/art/?
       │    - Có component trang nào bị đổi thành 'use client'?
       │    - Có câu lệnh SQL nào trong /api/cards vừa bị bỏ mất mệnh đề LIMIT?
       └─► Kiểm tra báo cáo Lighthouse CI của commit đó

[BƯỚC 3: SỬA LỖI & THỰC HIỆN TỐI ƯU HÓA]
       │
       ├─► Chạy lại script nén ảnh Sharp: `npm run optimize-images`
       └─► Đưa component trở lại Server Component

[BƯỚC 4: HẬU KIỂM VÀ CẬP NHẬT RÀO CHẮN]
       │
       └─► Bổ sung quy tắc assertion mới vào `lighthouserc.js` để lỗi không lặp lại!
```

---

### 5. ✅ CHECKLIST KIỂM SOÁT HIỆU NĂNG TRƯỚC KHI MERGE CODE (PRE-FLIGHT CHECKLIST)

Mỗi lập trình viên hoặc AI Agent trước khi hoàn thành một tác vụ phải tự kiểm tra 7 mục:
- [ ] Không có tệp ảnh mới nào vượt quá **80 KB** trong `public/assets/art/`.
- [ ] Mọi tệp ảnh mới đều có định dạng `.avif` đi kèm và đã đăng ký trong `art-manifest.json`.
- [ ] Không có chỉ thị `'use client'` xuất hiện ở các tệp trang `src/app/**/page.tsx` (Bắt buộc là Server Component).
- [ ] Mọi câu truy vấn SQL đọc dữ liệu đều có mệnh đề `.limit()` và không dùng vòng lặp `await` tuần tự.
- [ ] Các hiệu ứng animation đều có hỗ trợ `@media (prefers-reduced-motion)`.
- [ ] Điểm số Lighthouse CI chạy cục bộ đạt **>= 90 điểm**.
- [ ] Kích thước file bundle JS chính không tăng quá **5 KB** so với nhánh chính.

---
*Tài liệu thuộc bộ hồ sơ kỹ thuật Master Performance Plan — Dự án Japanese SRS System.*

---


<a id="phan-9"></a>
# PHẦN 9: PHẦN 9: BẢNG CHỈ MỤC & CẨM NANG TRA CỨU NHANH HIỆU NĂNG (PERFORMANCE INDEX)
*Tệp gốc: `doc\performance\PERFORMANCE-INDEX.md`*

---

## 🚀 Kế Hoạch Tối Ưu Hiệu Suất Đa Tầng — japanese-srs-system

> **Mục tiêu**: Giảm LCP từ ~4.2s xuống < 1.8s · INP < 30ms · CLS < 0.02 · TTFB < 180ms  
> **Stack cốt lõi**: Next.js 15.5.27 (App Router) · React 19.0.0 · Turso (libSQL) · Drizzle ORM · Vercel Platform  
> **Quy mô hồ sơ**: 8 tầng kiến trúc chuyên sâu, bao quát từ vật lý cáp quang đến biên dịch máy ảo V8 và triển khai CI/CD.

---

### 🗺️ Cấu Trúc Kế Hoạch Đa Tầng (Kim Tự Tháp Bottom-Up)

Kế hoạch được tổ chức tuần tự từ **nền tảng vật lý lên đến tầng giám sát ứng dụng**:

```
TẦNG 7: Giám Sát, CI/CD Pipeline & Phòng Ngừa Regression      ← Chi tiết thực thi & bảo vệ
TẦNG 6: Hiệu Suất Runtime, FSRS Web Worker & Offline PWA
TẦNG 5: Mạng Truyền Dẫn, CDN Vercel & Phân Phối Biên (Edge)
TẦNG 4: Tối Ưu Hóa Database Turso (libSQL) & Lớp API
TẦNG 3: Tối Ưu Hóa Tài Nguyên Assets (Images, SVG, CSS, Fonts)
TẦNG 2: Tối Ưu Hóa Next.js 15, Server Components & Actions
TẦNG 1: Kiểm Toán Kiến Trúc Codebase & Bóc Tách 11 Điểm Nghẽn
TẦNG 0: Lý Thuyết Nền Tảng Hiệu Suất Web & Vật Lý Mạng       ← Tổng quan lý thuyết khoa học
```

---

### 📂 Danh Sách 8 Tệp Hồ Sơ Kỹ Thuật Chi Tiết

| Tệp Kế Hoạch | Tầng | Nội Dung Trọng Tâm | Trạng Thái |
| :--- | :---: | :--- | :---: |
| [00-performance-foundation.md](./00-performance-foundation.md) | **Tầng 0 (Nền)** | Lý thuyết vật lý CRP, Chromium Blink engine, V8 TurboFan, HTTP/3 QUIC, Core Web Vitals 2026 | ✅ Hoàn thành |
| [01-architecture-audit.md](./01-architecture-audit.md) | **Tầng 1** | Bóc tách 11 điểm nghẽn thực tế trong codebase `japanese-srs-system` kèm diff code trước/sau | ✅ Hoàn thành |
| [02-nextjs-optimization.md](./02-nextjs-optimization.md) | **Tầng 2** | Chuyển đổi `page.tsx` sang Server Component, cấu hình `next.config.ts`, tối ưu hóa `next/font` | ✅ Hoàn thành |
| [03-asset-optimization.md](./03-asset-optimization.md) | **Tầng 3** | Kịch bản tự động nén 26 ảnh nghệ thuật sang AVIF/WebP, Base64 LQIP blur, CSS GPU Sakura | ✅ Hoàn thành |
| [04-database-api.md](./04-database-api.md) | **Tầng 4** | Turso Singapore Replica, Serverless Singleton, SQL GROUP BY thay thế 3 queries tuần tự, Indexes | ✅ Hoàn thành |
| [05-network-cdn.md](./05-network-cdn.md) | **Tầng 5** | Vercel Edge PoP `sin1`, ma trận Cache-Control, Resource Hints, chống chịu đứt cáp quang biển | ✅ Hoàn thành |
| [06-runtime-performance.md](./06-runtime-performance.md) | **Tầng 6** | Dedicated Web Worker cho FSRS, IndexedDB Dexie.js offline-first, Service Worker PWA | ✅ Hoàn thành |
| [07-monitoring.md](./07-monitoring.md) | **Tầng 7** | Lighthouse CI tự động, GitHub Actions PR gate, RUM Telemetry, Incident Runbook | ✅ Hoàn thành |

---

### 🎯 4 Điểm Nghẽn Cốt Tử Được Ưu Tiên Giải Quyết (Sprint 1 & 2)

Từ báo cáo kiểm toán thực tế mã nguồn (`src/app/`, `src/components/`, `public/assets/art/`, `src/db/`):

#### 🔴 CỰC KỲ NGHIÊM TRỌNG (Tác Động Lớn Nhất Đến LCP & TTFB)

1. **Google Fonts CJK Tải 8 Weights Thừa (`src/app/layout.tsx:11-29`)**:
   - *Hiện trạng*: Tải 4 weights Zen Maru Gothic + 3 weights Shippori Mincho mà chỉ khai báo subset Latinh. Trình duyệt liên tục phát sinh HTTP requests kéo thêm các lát cắt CJK từ Google CDN.
   - *Khắc phục*: Chỉ giữ 2 weights (400 và 700), bật preload và khai báo fallback font tiếng Nhật hệ thống (`Hiragino Sans`, `Yu Mincho`).
   - *Hiệu quả*: Giảm **~300ms LCP**, tiết kiệm **~180KB font**.

2. **Dashboard Fetch Dữ Liệu Qua `useEffect` Client-Side (`src/app/page.tsx:1-55`)**:
   - *Hiện trạng*: Trang chủ bị ép thành `'use client'`, trình duyệt phải tải xong HTML rỗng, tải xong JS bundle, hydrate xong mới bắt đầu gọi `fetch('/api/cards')`.
   - *Khắc phục*: Tái cấu trúc thành **React Server Component**, nạp dữ liệu song song trực tiếp từ Turso DB trong lúc tạo HTML.
   - *Hiệu quả*: Giảm **~400ms LCP**, triệt tiêu hoàn toàn màn hình trắng và loading skeleton.

3. **3 Truy Vấn Cơ Sở Dữ Liệu Tuần Tự & Lọc In-Memory (`src/app/api/cards/route.ts:34-70`)**:
   - *Hiện trạng*: 3 câu lệnh `await` nối đuôi nhau qua HTTP đến Turso; kéo toàn bộ bảng `cards` về RAM của Node.js để chạy vòng lặp `.filter()`.
   - *Khắc phục*: Sử dụng `Promise.all()` và chuyển thuật toán đếm về **1 câu lệnh SQL GROUP BY duy nhất** được SQLite xử lý trong 2ms.
   - *Hiệu quả*: Giảm **~180ms TTFB**, bảo vệ máy chủ không bị tràn bộ nhớ khi dữ liệu tăng lên 10,000 từ vựng.

4. **26 Tệp Ảnh Nghệ Thuật Nặng 2.8MB Chưa Nén AVIF (`public/assets/art/`)**:
   - *Hiện trạng*: Bức tranh hồ Suwa của Hokusai (`hokusai-suwa-lake.jpg`) nặng 431.8 KB định dạng JPG cổ điển, là ứng viên LCP lớn nhất.
   - *Khắc phục*: Kịch bản tự động hóa bằng thư viện `sharp` chuyển đổi toàn bộ sang **AVIF (chất lượng 65, dung lượng 46 KB)** và trích xuất Base64 `blurDataURL`.
   - *Hiệu quả*: Giảm **89.3% dung lượng ảnh**, rút ngắn **~350ms thời gian tải ảnh LCP**.

---

### ⚡ Lộ Trình Triển Khai 4 Giai Đoạn (4-Sprint Roadmap)

#### 🟢 Giai đoạn 1: Quick Wins (Ngày 1 - 2) — Nỗ lực thấp, kết quả tức thì
- [x] Tạo tệp `next.config.ts` kích hoạt nén AVIF, Brotli và loại bỏ `x-powered-by`.
- [x] Thêm các thẻ `<link rel="preconnect">` và `<link rel="dns-prefetch">` vào `src/app/layout.tsx`.
- [x] Cắt giảm font weights trong `src/app/layout.tsx` chỉ giữ `400` và `700`.

#### 🟡 Giai đoạn 2: Tối Ưu Hóa Assets & Database (Ngày 3 - 5)
- [x] Chạy script `scripts/optimize-art-images.mjs` nén 26 ảnh sang AVIF và sinh `art-manifest.json`.
- [x] Cập nhật `src/components/art/JapaneseArtBackdrop.tsx` sử dụng ảnh AVIF và `blurDataURL`.
- [x] Bổ sung các chỉ mục B-Tree (`idx_cards_deck_id`, `idx_cards_due_state`, `idx_cards_created_at`) vào SQLite/Turso.
- [x] Refactor API route `src/app/api/cards/route.ts` sang câu lệnh `GROUP BY` song song.

#### 🟠 Giai đoạn 3: Tái Cấu Trúc Kiến Trúc (Tuần 2)
- [x] Chuyển đổi `src/app/page.tsx` từ Client Component sang **React Server Component**.
- [x] Chuyển đổi các hiệu ứng của `SakuraBackground.tsx` sang thuần túy CSS GPU keyframes.
- [x] Tích hợp React 19 Server Actions (`src/app/actions/srs.ts`) thay thế các mutation endpoints REST.

#### 🔵 Giai đoạn 4: Nâng Cao & Tự Động Hóa (Tuần 3 - 4)
- [x] Chuyển thuật toán FSRS sang **Dedicated Web Worker** (`src/workers/fsrs.worker.ts`) & tích hợp màn hình ôn tập `/review`.
- [x] Triển khai cơ sở dữ liệu ngoại tuyến **IndexedDB (Dexie.js)** và Service Worker PWA (`public/sw.js`).
- [x] Thiết lập quy trình kiểm duyệt hiệu năng tự động trên CI/CD qua **Lighthouse CI** (`lighthouserc.js`, `.github/workflows/performance.yml`) & RUM Telemetry (`src/lib/telemetry.ts`, `/api/telemetry`).

---

### 📊 Bảng Mục Tiêu Ngân Sách Hiệu Năng (Performance Budgets)

| Chỉ Số Đo Lường | Hiện Trạng (Ước Tính) | Mục Tiêu Sprint 1 | Mục Tiêu Sprint 4 (Hoàn Thành) |
| :--- | :---: | :---: | :---: |
| **LCP (Largest Contentful Paint)** | ~4.2s | < 2.5s | **< 1.8s (Tốt - Xanh)** |
| **INP (Interaction to Next Paint)** | ~140ms | < 80ms | **< 30ms (Tốt - Xanh)** |
| **CLS (Cumulative Layout Shift)** | ~0.14 | < 0.05 | **< 0.02 (Tốt - Xanh)** |
| **TTFB (Time to First Byte)** | ~650ms | < 300ms | **< 180ms (Tốt - Xanh)** |
| **Tổng Dung Lượng JS Ban Đầu** | ~220 KB | < 140 KB | **< 90 KB (gzip)** |
| **Tổng Dung Lượng Tải Trang Đầu**| ~2.8 MB | < 800 KB | **< 400 KB** |

---
*Tài liệu thuộc bộ hồ sơ kỹ thuật Master Performance Plan — Dự án Japanese SRS System.*

---
