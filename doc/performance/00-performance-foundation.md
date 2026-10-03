# 00 — TẦNG NỀN: Lý Thuyết Nền Tảng Hiệu Suất Web & Khung Kiến Trúc

> **Định vị tài liệu**: Tầng 0 (Foundation Layer) — Khung lý thuyết vật lý, giao thức mạng, cơ chế browser rendering engine, runtime JavaScript và kiến trúc phân tán. Đây là kim chỉ nam khoa học làm nền tảng cho 7 tầng kỹ thuật chi tiết tiếp theo của dự án `japanese-srs-system`.  
> **Phạm vi đối tượng**: Full-stack Engineers, Performance Architects, AI Coding Agents.  
> **Ngữ cảnh hệ thống**: Next.js 15.5.27 (App Router), React 19, Turso Database (libSQL edge/HTTP), Drizzle ORM, Vercel Serverless Platform, FSRS Algorithm.

---

## 1. 🧠 Mental Model: Bản Chất Vật Lý Của Hiện Tượng "Web Chậm"

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

### 1.1. Browser Rendering Pipeline Chi Tiết

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

### 1.2. Critical Rendering Path (Đường Dẫn Render Tới Hạn)

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

### 1.3. Main Thread Contention & Jank (Hiện tượng giật lag khung hình)

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

### 1.4. Hiệu Ứng Domino (The Waterfall Cascade Effect)

Trong phát triển web hiện đại, sự chậm trễ hiếm khi xảy ra đơn lẻ mà hoạt động theo chuỗi phản ứng dây chuyền (Cascade):
1. Font chữ Nhật Bản (`Zen Maru Gothic`, `Shippori Mincho`) được nạp qua `@import` trong CSS.
2. Trình duyệt phải tải HTML $\rightarrow$ phát hiện link CSS $\rightarrow$ tải CSS $\rightarrow$ phân tích CSS $\rightarrow$ phát hiện URL của Font file $\rightarrow$ bắt đầu thiết lập kết nối TCP/TLS mới đến `fonts.gstatic.com` $\rightarrow$ tải font woff2.
3. Trong suốt thời gian font đang tải (khoảng 400ms - 800ms trên mạng di động), trình duyệt rơi vào trạng thái **FOIT (Flash of Invisible Text)** — toàn bộ chữ Kanji và Kana trên màn hình bị ẩn đi, khiến chỉ số **LCP (Largest Contentful Paint)** bị đẩy lùi nghiêm trọng.

---

## 2. 📊 Core Web Vitals (CWV) — Hệ Quy Chiếu Đánh Giá Của Google

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

### 2.1. LCP (Largest Contentful Paint) — Đo Lường Tốc Độ Tải Nội Dung Trọng Tâm

- **Định nghĩa**: Thời điểm phần tử nội dung trực quan lớn nhất (hình ảnh hero, video poster, hoặc khối văn bản lớn) trong khung nhìn (Viewport) được hiển thị hoàn chỉnh cho người dùng.
- **Cơ chế đo của trình duyệt**: API `PerformanceObserver` với entry type `largest-contentful-paint`. Trình duyệt liên tục cập nhật ứng viên LCP khi các phần tử mới xuất hiện và dừng ghi nhận ngay khi người dùng có tương tác đầu tiên (nhấn phím, cuộn trang, chạm màn hình).
- **Phân rã thành phần thời gian của LCP**:
  $$\text{LCP} = \text{TTFB} + \text{Resource Load Delay} + \text{Resource Load Duration} + \text{Element Render Delay}$$
  - **TTFB (Time to First Byte)**: Thời gian server xử lý và gửi byte HTML đầu tiên.
  - **Resource Load Delay**: Khoảng cách từ lúc nhận HTML đến khi trình duyệt phát hiện ra tài nguyên LCP và bắt đầu tải. (Nếu hình ảnh LCP nằm trong CSS background hoặc được inject bằng JavaScript `useEffect`, độ trễ này có thể lên tới 500ms - 1500ms!).
  - **Resource Load Duration**: Thời gian truyền tải bytes của tài nguyên qua mạng (phụ thuộc kích thước file AVIF/WebP/JPG).
  - **Element Render Delay**: Thời gian từ khi tải xong tài nguyên đến khi trình duyệt vẽ xong lên màn hình (bị ảnh hưởng nếu Main Thread bị chiếm bởi JS hydration hoặc CSSOM chưa sẵn sàng).

### 2.2. INP (Interaction to Next Paint) — Đo Lường Độ Nhạy Tương Tác

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

### 2.3. CLS (Cumulative Layout Shift) — Đo Lường Độ Ổn Định Thị Giác

- **Định nghĩa**: Tổng điểm số của tất cả các lần dịch chuyển bố cục đột ngột, bất ngờ của các phần tử nhìn thấy trong suốt thời gian tồn tại của trang.
- **Công thức tính điểm**:
  $$\text{Layout Shift Score} = \text{Impact Fraction} \times \text{Distance Fraction}$$
  - **Impact Fraction**: Tỷ lệ phần trăm diện tích khung nhìn bị ảnh hưởng bởi phần tử dịch chuyển giữa 2 khung hình liên tiếp.
  - **Distance Fraction**: Khoảng cách lớn nhất mà phần tử không ổn định bị dịch chuyển chia cho chiều cao (hoặc chiều rộng) của khung nhìn.
- **Nguyên nhân cốt lõi trong `japanese-srs-system`**:
  1. Hình ảnh nghệ thuật Nhật Bản (như `hokusai-suwa-lake.jpg`, tranh sóng `golden-waves-kin-nami.jpg`) được render mà **không khai báo trước thuộc tính `width`, `height` hoặc `aspect-ratio`**. Khi ảnh tải xong, nó đẩy toàn bộ nội dung phía dưới xuống đột ngột.
  2. Font chữ nhảy cỡ (Font Swapping): Khi font hệ thống (`sans-serif`) được thay thế bằng `Zen Maru Gothic` hoặc `Shippori Mincho`, do số đo độ rộng con chữ (glyph advance metrics) khác nhau, toàn bộ các đoạn văn bản bị vỡ dòng và nhảy vị trí.

---

## 3. 🌐 Giao Thức Mạng: HTTP/1.1, HTTP/2, HTTP/3 & Hạ Tầng Kết Nối

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

### 3.1. Phân Tích Hiện Tượng Head-of-Line (HOL) Blocking

- **Trong HTTP/1.1**: Trình duyệt chỉ có thể gửi tối đa 6 kết nối TCP đồng thời cho mỗi tên miền. Mỗi kết nối chỉ tải tuần tự từng tài nguyên (Request A $\rightarrow$ Response A $\rightarrow$ Request B $\rightarrow$ Response B). Nếu Request A là một file ảnh lớn 400KB bị nghẽn, các request JS/CSS quan trọng phía sau bị kẹt cứng.
- **Trong HTTP/2**: Giải quyết vấn đề bằng **Binary Framing Layer** và **Stream Multiplexing** — tất cả tài nguyên được bẻ nhỏ thành các frame nhị phân truyền song song trên **duy nhất 1 kết nối TCP**. Tuy nhiên, nếu xảy ra hiện tượng rớt packet ở tầng TCP (rất phổ biến trên mạng di động 4G/5G ở Việt Nam khi sóng yếu), toàn bộ các luồng khác trên kết nối TCP đó đều bị chặn lại chờ truyền lại packet mất (**TCP-level HOL Blocking**).
- **Trong HTTP/3 (QUIC)**: Chạy trên giao thức UDP. Mỗi stream tài nguyên hoàn toàn độc lập ở cả tầng ứng dụng lẫn tầng truyền tải. Mất 1 packet của file ảnh `sakura.jpg` hoàn toàn không làm gián đoạn việc tải file `page.js`!

### 3.2. Chi Phí Handshake & 0-RTT Resumption

Để thiết lập kết nối an toàn HTTPS trước khi byte dữ liệu đầu tiên được truyền đi:
- **Chu kỳ cổ điển (TCP + TLS 1.2)**: 
  $\text{DNS Lookup} (1 \text{ RTT}) + \text{TCP 3-way Handshake} (1 \text{ RTT}) + \text{TLS Handshake} (2 \text{ RTT}) = 4 \text{ RTTs}$.
  Nếu độ trễ RTT từ Việt Nam sang server Mỹ là 180ms, chỉ riêng việc mở kết nối đã tiêu tốn:
  $$4 \times 180\text{ms} = 720\text{ms}$$
  trước khi server bắt đầu xử lý yêu cầu!
- **Chu kỳ hiện đại (TLS 1.3 & QUIC/HTTP/3)**:
  Tích hợp mã hóa vào ngay gói tin bắt tay đầu tiên. Với khách hàng quay lại (repeat visitors), tính năng **0-RTT Session Resumption** cho phép trình duyệt gửi dữ liệu mã hóa ứng dụng ngay trong gói tin đầu tiên, tiết kiệm hoàn toàn độ trễ mở kết nối.

### 3.3. Thuật Toán TCP Slow Start & Tác Động Tới LCP

Giao thức TCP sử dụng thuật toán điều khiển tắc nghẽn gọi là **TCP Slow Start**. Khi một kết nối mới được tạo, TCP không gửi toàn bộ dữ liệu ngay lập tức mà bắt đầu với một cửa sổ tắc nghẽn nhỏ (**Congestion Window - cwnd**, thông thường là 10 hoặc 14 TCP packets $\approx 14.6\text{KB}$).
Sau mỗi RTT nhận được ACK thành công, kích thước cửa sổ tăng gấp đôi:
- Vòng 1: $14.6\text{KB}$
- Vòng 2: $29.2\text{KB}$
- Vòng 3: $58.4\text{KB}$
- Vòng 4: $116.8\text{KB}$
- Vòng 5: $233.6\text{KB}$

**Hệ quả trực tiếp**: Nếu tài liệu HTML hoặc file JS ban đầu nặng 150KB, trình duyệt phải mất ít nhất 4 đến 5 vòng RTT chỉ để tải xong file, bất kể đường truyền của người dùng là cáp quang 1Gbps! Đây là lý do tại sao **Inline Critical CSS** và giữ payload HTML ban đầu dưới **14KB (đạt giới hạn 10 TCP segments)** mang lại bước nhảy vọt về tốc độ hiển thị.

---

## 4. ⚙️ JavaScript Engine & V8 Execution Pipeline

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

### 4.1. Chi Phí Parse & Compile Của JavaScript Không Hề Miễn Phí

Nhiều lập trình viên lầm tưởng một file ảnh 100KB và một file JavaScript 100KB có chi phí như nhau. Đây là sai lầm nghiêm trọng:
- File ảnh: Tải về $\rightarrow$ Giải mã $\rightarrow$ GPU vẽ lên màn hình.
- File JS: Tải về $\rightarrow$ **Parse cú pháp** $\rightarrow$ **Xây dựng AST** $\rightarrow$ **Biên dịch Bytecode** $\rightarrow$ **Thực thi** $\rightarrow$ **Tạo đối tượng trong Heap** $\rightarrow$ **Chi phí dọn dẹp rác (Garbage Collection)**.

Một ứng dụng web tải 1MB JavaScript trên một điện thoại phân khúc trung cấp (Android Chip Snapdragon 680) có thể mất tới **1.5 giây đến 3 giây chỉ riêng thời gian CPU giải nén và phân tích mã nguồn**, đẩy INP và TTI lên mức thảm họa.

### 4.2. Garbage Collection (GC) Pauses & Generational Hypothesis

V8 quản lý bộ nhớ tự động thông qua bộ dọn rác (Garbage Collector). V8 phân chia bộ nhớ Heap thành 2 thế hệ dựa trên **Giả thuyết thế hệ (Generational Hypothesis)**: "Hầu hết các đối tượng trong chương trình sinh ra và chết đi rất nhanh".
- **Young Generation (Nursery & Intermediate)**: Chứa các biến tạm thời, props ngắn hạn, closure sinh ra trong quá trình render. Được quét dọn thường xuyên bởi thuật toán **Scavenger (Minor GC)** tốc độ cao (1-3ms).
- **Old Generation**: Chứa các đối tượng sống sót qua nhiều chu kỳ thu gom (như cache danh sách từ vựng, state toàn cục của SRS). Được thu gom bởi thuật toán **Mark-Sweep-Compact (Major GC)**.

**Nguy cơ trong ứng dụng học tập SRS**: Nếu ứng dụng liên tục tạo mới hàng nghìn object trong mỗi lượt lật thẻ flashcard (ví dụ: tạo lại mảng thẻ lọc, map lại DTO, tính toán FSRS tạo ra các đối tượng Date trung gian không giải phóng), Major GC sẽ bị kích hoạt định kỳ. Khi Major GC chạy, nó sẽ tạm dừng toàn bộ luồng thực thi chính (**Stop-The-World pause**), gây ra hiện tượng giật lag bất ngờ đúng lúc người dùng bấm nút chấm điểm thẻ bài.

---

## 5. ⚛️ Kiến Trúc React 19 & Next.js 15 App Router

Dự án sử dụng **Next.js 15.5.27** và **React 19**, đại diện cho bước chuyển biến kiến trúc lớn nhất trong lịch sử web hiện đại: chuyển từ Client-Side Rendering sang mô hình hỗn hợp **React Server Components (RSC)**.

### 5.1. Mô Hình React Server Components (RSC) vs Client Components

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

### 5.2. Streaming SSR & Progressive Hydration với Suspense

Trong SSR truyền thống, server phải chờ đợi truy vấn cơ sở dữ liệu hoàn tất 100% mới có thể bắt đầu tạo HTML gửi về cho client. Nếu truy vấn Turso mất 350ms, người dùng phải nhìn màn hình trắng suốt 350ms đó.

Với **React 19 Streaming SSR**:
- Server có thể gửi ngay phần khung HTML tĩnh (Header, Navigation, Background) chỉ trong **20ms**.
- Các phần tử chậm (như danh sách thẻ từ vựng cần nạp từ cơ sở dữ liệu) được bọc trong `<Suspense fallback={<Skeleton />}>`.
- Server gửi khối fallback về trước, sau khi dữ liệu DB về, server sẽ tự động stream tiếp đoạn HTML hoàn chỉnh và script thay thế vào cùng một HTTP response mà không cần mở kết nối mới.

---

## 6. 🗄️ Độ Trễ Cơ Sở Dữ Liệu & Mạng Phân Tán (Database Latency Physics)

### 6.1. Quy Luật Vận Tốc Ánh Sáng Trong Cáp Quang

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

### 6.2. Hiệu Ứng Cấp Số Nhân Của N+1 Queries Trên Serverless

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

## 7. 🔍 Phân Tích Thực Trạng Stack `japanese-srs-system`

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

## 8. 🛠️ Đo Lường, Viễn Thám & Công Cụ Kiểm Định (Telemetry & Tooling)

### 8.1. Lab Data (Dữ Liệu Thí Nghiệm) vs Field Data (Dữ Liệu Hiện Trường)

- **Lab Data (Synthetic)**: Đo bằng Lighthouse, Chrome DevTools trên máy lập trình viên hoặc CI/CD runner. Môi trường mạng cố định, CPU mô phỏng. Dùng để gỡ lỗi và phát hiện regression trước khi merge code.
- **Field Data (Real User Monitoring - RUM)**: Thu thập từ người dùng thực tế thông qua Chrome User Experience Report (CrUX) và Vercel Speed Insights. Đây là dữ liệu Google dùng để xếp hạng tìm kiếm. Lab score có thể đạt 100 điểm, nhưng nếu người dùng ở khu vực mạng kém gặp lỗi font, Field data vẫn rơi vào vùng Đỏ!

### 8.2. Thiết Lập Khung Đo Lường Chuẩn Với PerformanceObserver API

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

## 9. 📐 Khung Mục Tiêu Ngân Sách Hiệu Suất (Performance Budgets)

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

## 10. 🗺️ Bản Đồ Chiến Lược 8 Tầng & Lộ Trình Triển Khai (Roadmap)

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

### Ma Trận Tác Động vs Nỗ Lực (Impact vs Effort Matrix)

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

### Dự Báo Gia Tăng Hiệu Suất Tổng Thể Sau Khi Hoàn Thành Cả 8 Tầng:
- **LCP**: Giảm từ $\approx 4.1\text{s} \longrightarrow < \mathbf{1.5s}$ (Cải thiện **63%**).
- **INP**: Giảm từ $\approx 140\text{ms} \longrightarrow < \mathbf{40ms}$ (Cải thiện **71%**).
- **TTFB**: Giảm từ $\approx 650\text{ms} \longrightarrow < \mathbf{150ms}$ (Cải thiện **76%**).
- **Tổng dung lượng tải ban đầu**: Giảm từ $\approx 1.8\text{MB} \longrightarrow < \mathbf{380KB}$ (Cắt giảm **78% băng thông**).

---
*Tài liệu thuộc bộ hồ sơ kỹ thuật Master Performance Plan — Dự án Japanese SRS System.*
