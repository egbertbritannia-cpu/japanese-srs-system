# 🏯 TÀI LIỆU 04: TÁI THIẾT KẾ TRANG TỔNG QUAN (SRC/APP/PAGE.TSX)
## Dự án: Japanese SRS System (FSRS)
## Mục tiêu: Bento Grid phong cách Trà Thất & Cung điện Nhật Bản (Honmaru Bento)

---

### 1. PHÂN TÍCH THAY ĐỔI TRÊN TRANG DASHBOARD
- **Hiện trạng cũ**: 3 khối hộp nền xám tối đơn điệu, font chữ hệ thống khô khan, không có điểm nhấn hay cảm hứng học tập.
- **Thiết kế mới (Wa-Style Honmaru)**:
  1. **Banner Anh đào & Sóng biển Seigaiha**: Dải sóng Matcha chuẩn ảnh chụp kết hợp huy hiệu cổng thiêng Torii.
  2. **Thanh tiến độ Daruma (Daruma Goal Tracker)**: Búp bê Daruma tự động điểm mắt theo tỷ lệ hoàn thành thẻ học trong ngày, tạo động lực tâm lý học tập (Gamification theo văn hóa Nhật).
  3. **3 Thẻ gỗ điều ước Ema (絵馬)**:
     - *Thẻ cần ôn (復習 - Due)*: Màu hồng thắm Sakura & đỏ son Torii.
     - *Thẻ mới (新規 - New)*: Màu xanh cốm Matcha Seigaiha.
     - *Tỉ lệ ghi nhớ (定着率 - Retention)*: Màu vàng kim Yamabuki cao quý.
  4. **Hộp ngạn ngữ Kotowaza (諺 - Lời vàng Phù Tang)**: Thẻ cuộn thư pháp chúc người học kiên trì mỗi ngày.
  5. **Nút bấm phong cách Thần đạo**: Nút bắt đầu ôn tập đỏ son Torii với hiệu ứng đổ bóng đa tầng.

---

### 2. MÃ NGUỒN HOÀN CHỈNH CHO `src/app/page.tsx`
Agent chỉ cần sao chép toàn bộ khối mã dưới đây và ghi đè vào file `src/app/page.tsx`:

```tsx
import Link from 'next/link';
import { ToriiIcon, SakuraIcon, SensuFanIcon } from '@/components/japanese/Icons';
import { DarumaMascot } from '@/components/japanese/DarumaMascot';

/**
 * Dashboard (Honmaru - 本丸): Tổng quan tiến độ học tập, FSRS stats & Thần chú may mắn
 */
export default function DashboardPage() {
  const stats = {
    dueToday: 15,
    newCards: 5,
    retentionRate: '90%',
    completedToday: 8,
  };

  const totalTodayGoal = stats.dueToday + stats.completedToday;
  const progressPercent = totalTodayGoal > 0 ? Math.round((stats.completedToday / totalTodayGoal) * 100) : 100;

  return (
    <main style={{ maxWidth: '1050px', margin: '2rem auto', padding: '0 1.5rem 3rem' }}>
      {/* 1. HERO BANNER: HỌA TIẾT SEIGAIHA XANH MATCHA (#88A752) CHUẨN ẢNH CHỤP */}
      <section
        className="wagara-seigaiha-matcha"
        style={{
          borderRadius: '20px',
          padding: '2.5rem 2rem',
          color: '#FFFFFF',
          marginBottom: '2.5rem',
          boxShadow: 'var(--shadow-karuta)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        {/* Lớp phủ mờ bảo vệ độ tương phản chữ */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(112, 141, 62, 0.92) 0%, rgba(136, 167, 82, 0.85) 100%)',
            zIndex: 1,
          }}
        />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '650px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.25rem 0.75rem',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(8px)',
                borderRadius: '999px',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-maru)',
                fontWeight: 600,
              }}
            >
              <SakuraIcon size={16} color="#FFFFFF" />
              Chào mừng bạn đến với trà thất học tập
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-mincho)',
              fontSize: '2.5rem',
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: '0.75rem',
              letterSpacing: '-0.02em',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
            }}
          >
            Học sâu Nhớ lâu cùng FSRS
          </h1>
          <p
            style={{
              fontSize: '1.05rem',
              lineHeight: 1.6,
              opacity: 0.95,
              fontFamily: 'var(--font-maru)',
              fontWeight: 400,
            }}
          >
            Hệ thống lặp lại ngắt quãng kết hợp thuật toán tối ưu nhận thức FSRS, quy tắc Thông tin tối thiểu và nét vẽ nghệ thuật truyền thống Nhật Bản.
          </p>
        </div>

        {/* Nút hành động nhanh trên Hero */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', gap: '0.75rem' }}>
          <Link
            href="/review"
            className="btn-torii"
            style={{
              padding: '1rem 2rem',
              fontSize: '1.05rem',
              boxShadow: '0 8px 24px rgba(217, 56, 30, 0.4)',
            }}
          >
            <ToriiIcon size={20} color="#FFFFFF" />
            Bắt đầu bài học ngay
          </Link>
        </div>
      </section>

      {/* 2. KHU VỰC TIẾN ĐỘ DARUMA (DARUMA GOAL MILESTONE TRACKER) */}
      <section
        style={{
          background: 'var(--washi-surface)',
          border: '1px solid var(--washi-border)',
          borderRadius: '16px',
          padding: '1.75rem 2rem',
          marginBottom: '2.5rem',
          boxShadow: 'var(--shadow-washi-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          flexWrap: 'wrap',
        }}
      >
        <DarumaMascot progressPercentage={progressPercent} size={76} />

        <div style={{ flex: 1, minWidth: '280px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.25rem', color: 'var(--sumi-ink)', fontWeight: 700 }}>
                Quyết tâm hôm nay (本日の目標)
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--sumi-faded)' }}>
                Đã hoàn thành <strong>{stats.completedToday}</strong> / {totalTodayGoal} thẻ ({progressPercent}%)
              </p>
            </div>
            <span
              style={{
                fontFamily: 'var(--font-mincho)',
                fontWeight: 800,
                fontSize: '1.35rem',
                color: progressPercent >= 100 ? '#F59E0B' : 'var(--matcha-deep)',
              }}
            >
              {progressPercent}%
            </span>
          </div>

          {/* Thanh tiến độ họa tiết lông tên Yagasuri */}
          <div
            style={{
              height: '14px',
              background: '#F0ECE4',
              borderRadius: '999px',
              overflow: 'hidden',
              position: 'relative',
              border: '1px solid var(--washi-border)',
            }}
          >
            <div
              className="wagara-yagasuri"
              style={{
                height: '100%',
                width: `${progressPercent}%`,
                backgroundColor: 'var(--matcha-primary)',
                borderRadius: '999px',
                transition: 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            />
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--sumi-faded)', marginTop: '0.4rem' }}>
            💡 <em>Khi đạt 50%, mắt trái búp bê Daruma sẽ mở; đạt 100%, búp bê sẽ khai mở trọn vẹn cả hai mắt!</em>
          </p>
        </div>
      </section>

      {/* 3. BENTO GRID: 3 THẺ ĐIỀU ƯỚC EMA (絵馬 STAT CARDS) */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem',
        }}
      >
        {/* CARD 1: DUE TODAY (THẺ CẦN ÔN) */}
        <div
          className="card-karuta"
          style={{
            padding: '1.75rem',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF9F9 100%)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <span
                style={{
                  display: 'inline-block',
                  padding: '0.2rem 0.6rem',
                  background: 'var(--torii-subtle)',
                  color: 'var(--torii-red)',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-maru)',
                  marginBottom: '0.5rem',
                }}
              >
                復習 · CẦN ÔN TẬP
              </span>
              <h3 style={{ color: 'var(--sumi-charcoal)', fontSize: '0.95rem', fontWeight: 600 }}>
                Thẻ đến hạn hôm nay
              </h3>
            </div>
            <div className="inkan-stamp-badge" title="Đã đồng bộ FSRS">
              期
            </div>
          </div>
          <p style={{ fontFamily: 'var(--font-mincho)', fontSize: '3rem', fontWeight: 800, color: 'var(--torii-red)', lineHeight: 1 }}>
            {stats.dueToday}
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--sumi-faded)', marginTop: '0.5rem' }}>
            Khoảng cách ngắt quãng tối ưu theo FSRS
          </p>
        </div>

        {/* CARD 2: NEW CARDS (THẺ MỚI) */}
        <div
          className="card-karuta"
          style={{
            padding: '1.75rem',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAF2 100%)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <span
                style={{
                  display: 'inline-block',
                  padding: '0.2rem 0.6rem',
                  background: 'var(--matcha-subtle)',
                  color: 'var(--matcha-deep)',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-maru)',
                  marginBottom: '0.5rem',
                }}
              >
                新規 · TỪ VỰNG MỚI
              </span>
              <h3 style={{ color: 'var(--sumi-charcoal)', fontSize: '0.95rem', fontWeight: 600 }}>
                Thẻ mới sẵn sàng nạp
              </h3>
            </div>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '8px',
                background: 'var(--matcha-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--matcha-deep)',
                fontFamily: 'var(--font-mincho)',
                fontWeight: 700,
              }}
            >
              新
            </div>
          </div>
          <p style={{ fontFamily: 'var(--font-mincho)', fontSize: '3rem', fontWeight: 800, color: 'var(--matcha-deep)', lineHeight: 1 }}>
            {stats.newCards}
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--sumi-faded)', marginTop: '0.5rem' }}>
            Áp dụng nguyên tắc câu đục lỗ i + 1
          </p>
        </div>

        {/* CARD 3: RETENTION RATE (TỈ LỆ GHI NHỚ) */}
        <div
          className="card-karuta"
          style={{
            padding: '1.75rem',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #FFFDF5 100%)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <span
                style={{
                  display: 'inline-block',
                  padding: '0.2rem 0.6rem',
                  background: 'var(--yamabuki-light)',
                  color: 'var(--yamabuki-amber)',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-maru)',
                  marginBottom: '0.5rem',
                }}
              >
                定着率 · TRÍ NHỚ BỀN VỮNG
              </span>
              <h3 style={{ color: 'var(--sumi-charcoal)', fontSize: '0.95rem', fontWeight: 600 }}>
                Tỉ lệ ghi nhớ mục tiêu
              </h3>
            </div>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '8px',
                background: 'var(--yamabuki-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--yamabuki-amber)',
                fontFamily: 'var(--font-mincho)',
                fontWeight: 700,
              }}
            >
              極
            </div>
          </div>
          <p style={{ fontFamily: 'var(--font-mincho)', fontSize: '3rem', fontWeight: 800, color: '#D97706', lineHeight: 1 }}>
            {stats.retentionRate}
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--sumi-faded)', marginTop: '0.5rem' }}>
            Mức ghi nhớ tối ưu theo FSRS (R = 0.90)
          </p>
        </div>
      </section>

      {/* 4. HỘP THÀNH NGỮ KOTOWAZA & NÚT ĐIỀU HƯỚNG */}
      <section
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          background: 'var(--washi-surface)',
          padding: '1.75rem 2rem',
          borderRadius: '16px',
          border: '1px solid var(--washi-border)',
          boxShadow: 'var(--shadow-washi-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', maxWidth: '550px' }}>
          <SensuFanIcon size={32} color="var(--matcha-deep)" />
          <div>
            <h4 style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.05rem', color: 'var(--sumi-ink)', fontWeight: 700 }}>
              「 塵も積もれば山となる 」
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--sumi-faded)' }}>
              <em>(Bụi tích tụ sẽ hóa thành núi cao · Học tập mỗi ngày tích lũy tri thức vô tận)</em>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link href="/cards/new" className="btn-matcha">
            ✨ Nhờ AI soạn thẻ mới
          </Link>
          <Link href="/cards" className="btn-washi">
            📚 Quản lý thư viện thẻ
          </Link>
        </div>
      </section>
    </main>
  );
}
```
