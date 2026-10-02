'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ToriiIcon, SensuFanIcon, OrizuruIcon } from '@/components/japanese/Icons';
import { JapaneseArtBackdrop } from '@/components/art/JapaneseArtBackdrop';

export default function IntegrationsPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ configured: boolean; authenticated: boolean; userEmail?: string }>({
    configured: false,
    authenticated: false,
  });

  // Google Sheets state
  const [sheetUrl, setSheetUrl] = useState('');
  const [sheetPreview, setSheetPreview] = useState<any[]>([]);
  const [sheetMessage, setSheetMessage] = useState<string | null>(null);

  // Google Calendar state
  const [studyTime, setStudyTime] = useState('20:00');
  const [recurDaily, setRecurDaily] = useState(true);
  const [calendarMessage, setCalendarMessage] = useState<string | null>(null);

  // Google Tasks state
  const [taskMessage, setTaskMessage] = useState<string | null>(null);
  const [isHashDomain, setIsHashDomain] = useState(false);

  // Fetch status on load
  useEffect(() => {
    fetchStatus();
    if (typeof window !== 'undefined' && /japanese-srs-system-[a-z0-9]{9}-/.test(window.location.hostname)) {
      setIsHashDomain(true);
    }
  }, []);

  async function fetchStatus() {
    try {
      const res = await fetch('/api/google/status');
      const data = await res.json();
      if (data.success) {
        setStatus({
          configured: data.configured,
          authenticated: data.authenticated,
          userEmail: data.userEmail,
        });
      }
    } catch (e) {
      console.error('Lỗi kiểm tra Google status:', e);
    }
  }

  async function handleConnectGoogle() {
    try {
      const res = await fetch('/api/google/auth-url');
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Vui lòng cấu hình GOOGLE_CLIENT_ID và GOOGLE_CLIENT_SECRET trong file .env');
      }
    } catch (e) {
      alert('Không thể kết nối đến máy chủ xác thực Google');
    }
  }

  async function handleDisconnectGoogle() {
    if (!confirm('Bạn có chắc muốn ngắt kết nối tài khoản Google?')) return;
    try {
      await fetch('/api/google/disconnect', { method: 'POST' });
      await fetchStatus();
      alert('Đã ngắt kết nối Google thành công.');
    } catch {
      alert('Lỗi khi ngắt kết nối');
    }
  }

  // 1. Google Sheets: Export to new Google Sheet
  async function handleExportSheet() {
    setLoading(true);
    setSheetMessage(null);
    try {
      const res = await fetch('/api/google/sheets/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format: 'sheet' }),
      });
      const data = await res.json();
      if (data.success) {
        setSheetMessage(`🎉 Đã xuất thành công ${data.rowCount} thẻ! [Bấm vào đây để mở Google Sheet](${data.spreadsheetUrl})`);
        window.open(data.spreadsheetUrl, '_blank');
      } else {
        setSheetMessage(`❌ ${data.error || 'Lỗi khi tạo Google Sheet'}`);
      }
    } catch (e: any) {
      setSheetMessage(`❌ Lỗi kết nối: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  // 1b. Google Sheets: Download CSV directly
  function handleDownloadCsv() {
    window.open('/api/google/sheets/export?format=csv', '_blank');
  }

  // 1c. Google Sheets: Preview/Import
  async function handlePreviewSheet() {
    if (!sheetUrl.trim()) return;
    setLoading(true);
    setSheetMessage(null);
    try {
      const res = await fetch('/api/google/sheets/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urlOrId: sheetUrl, action: 'preview' }),
      });
      const data = await res.json();
      if (data.success) {
        setSheetPreview(data.preview || []);
        setSheetMessage(`✅ Đã tìm thấy ${data.cardsCount} dòng từ vựng trong bảng tính!`);
      } else {
        setSheetMessage(`❌ ${data.error}`);
      }
    } catch (e: any) {
      setSheetMessage(`❌ Lỗi: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleExecuteImport() {
    if (!confirm(`Bạn có chắc muốn nạp ${sheetPreview.length} từ vựng vào bộ thẻ JPD133?`)) return;
    setLoading(true);
    try {
      const res = await fetch('/api/google/sheets/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urlOrId: sheetUrl, action: 'import', deckId: 'deck_jpd133' }),
      });
      const data = await res.json();
      if (data.success) {
        setSheetMessage(`🎉 ${data.message}`);
        setSheetPreview([]);
      } else {
        setSheetMessage(`❌ ${data.error}`);
      }
    } catch (e: any) {
      setSheetMessage(`❌ Lỗi: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  // 2. Google Calendar: 1-Click Quick Add Web Link
  async function handleCalendarQuickAdd() {
    try {
      const res = await fetch('/api/google/calendar/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ time: studyTime, recurDaily, mode: 'quick_add' }),
      });
      const data = await res.json();
      if (data.quickAddUrl) {
        window.open(data.quickAddUrl, '_blank');
      }
    } catch (e: any) {
      alert('Lỗi tạo link lịch học: ' + e.message);
    }
  }

  // 2b. Google Calendar: Direct API Sync
  async function handleCalendarApiSync() {
    setLoading(true);
    setCalendarMessage(null);
    try {
      const res = await fetch('/api/google/calendar/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ time: studyTime, recurDaily, mode: 'api_sync' }),
      });
      const data = await res.json();
      if (data.success) {
        setCalendarMessage(`🎉 ${data.message}`);
        if (data.htmlLink) window.open(data.htmlLink, '_blank');
      } else {
        setCalendarMessage(`❌ ${data.error}`);
      }
    } catch (e: any) {
      setCalendarMessage(`❌ Lỗi: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  // 3. Google Tasks: Sync daily goals
  async function handleSyncTasks() {
    setLoading(true);
    setTaskMessage(null);
    try {
      const res = await fetch('/api/google/tasks/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dueCount: 15, newCount: 5 }),
      });
      const data = await res.json();
      if (data.success) {
        setTaskMessage(`🎉 ${data.message} (Kiểm tra ứng dụng Google Tasks trên điện thoại hoặc thanh bên Gmail)`);
      } else {
        setTaskMessage(`❌ ${data.error || 'Cần kết nối Google trước'}`);
      }
    } catch (e: any) {
      setTaskMessage(`❌ Lỗi: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: '1050px', margin: '2rem auto', padding: '0 1.5rem 4rem' }}>
      {/* CẢNH BÁO TÊN MIỀN TẠM THỜI TRÊN VERCEL */}
      {isHashDomain && (
        <div
          style={{
            background: '#FEF3C7',
            border: '1px solid #F59E0B',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            boxShadow: 'var(--shadow-washi-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.4rem' }}>💡</span>
            <div>
              <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 700, color: '#92400E' }}>
                Bạn đang truy cập qua link bản build tạm thời (mỗi lần build sẽ đổi mã băm ngẫu nhiên)
              </p>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#B45309' }}>
                Để kết nối Google không bị báo lỗi <code>redirect_uri_mismatch</code>, hãy sử dụng link chính thức cố định.
              </p>
            </div>
          </div>
          <a
            href="https://japanese-srs-system-git-main-cassius1.vercel.app/integrations"
            className="btn-matcha"
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', textDecoration: 'none', background: '#D97706' }}
          >
            👉 Chuyển sang Tên miền cố định
          </a>
        </div>
      )}

      {/* 1. HERO BANNER WA-STYLE CÓ HOA VĂN MẠ VÀNG RINPA */}
      <section
        className="wagara-seigaiha-matcha"
        style={{
          borderRadius: '20px',
          padding: '2.5rem 2rem',
          color: '#FFFFFF',
          marginBottom: '2rem',
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
        <JapaneseArtBackdrop
          src="/assets/art/rinpa-gold-waves-clouds.jpg"
          alt="Trường phái Rinpa sóng vàng và mây hoa"
          opacity={0.24}
          blendMode="overlay"
          objectPosition="center"
        />

        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(23, 73, 77, 0.92) 0%, rgba(38, 110, 115, 0.86) 100%)',
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
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(8px)',
                borderRadius: '999px',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-maru)',
                fontWeight: 600,
              }}
            >
              <SensuFanIcon size={16} color="#FFFFFF" />
              Google Workspace 連携 · Tiện ích Mở rộng
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.75rem' }}>
            <div
              className="tategaki-box"
              style={{
                borderColor: '#D4AF37',
                color: '#FFFFFF',
                background: 'rgba(217, 56, 30, 0.9)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                fontSize: '0.8rem',
                padding: '0.75rem 0.35rem',
                flexShrink: 0,
              }}
            >
              連係網 · 雲端
            </div>
            <div>
              <h1
                style={{
                  fontFamily: 'var(--font-mincho)',
                  fontSize: '2.3rem',
                  fontWeight: 800,
                  lineHeight: 1.25,
                  margin: 0,
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                }}
              >
                Đồng bộ Bảng tính, Lịch học &amp; To-Do List
              </h1>
            </div>
          </div>
          <p
            style={{
              fontSize: '1rem',
              lineHeight: 1.6,
              opacity: 0.95,
              fontFamily: 'var(--font-maru)',
            }}
          >
            Kết nối ứng dụng học tiếng Nhật với hệ sinh thái Google của bạn. Tự động nhắc nhở ôn tập FSRS mỗi ngày, đồng bộ từ vựng 2 chiều với Google Sheets và theo dõi mục tiêu học tập qua Google Tasks.
          </p>
        </div>

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            <OrizuruIcon size={46} color="#FFFFFF" />
          </div>
        </div>
      </section>

      {/* 2. TRẠNG THÁI KẾT NỐI TÀI KHOẢN GOOGLE */}
      <section
        style={{
          background: 'var(--washi-surface)',
          border: '1px solid var(--washi-border)',
          borderRadius: '16px',
          padding: '1.5rem 2rem',
          marginBottom: '2.5rem',
          boxShadow: 'var(--shadow-washi-md)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: status.authenticated ? 'rgba(16, 185, 129, 0.12)' : 'rgba(217, 56, 30, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${status.authenticated ? '#10B981' : '#D9381E'}`,
            }}
          >
            <span style={{ fontSize: '1.4rem' }}>{status.authenticated ? '🟢' : '⚪'}</span>
          </div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.15rem', color: 'var(--sumi-ink)', fontWeight: 700, margin: 0 }}>
              {status.authenticated ? 'Tài khoản Google đã kết nối' : 'Chưa kết nối tài khoản Google'}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--sumi-faded)', margin: '0.25rem 0 0' }}>
              {status.authenticated
                ? 'Đã kết nối tài khoản Google để đồng bộ tự động 2 chiều.'
                : 'Trang web hoạt động 100% tự do mà KHÔNG CẦN ĐĂNG NHẬP. Các tính năng "1-Click Thêm vào Calendar", "Tải CSV" & "Nhập Sheet công khai" đều dùng được ngay!'}
            </p>
          </div>
        </div>

        <div>
          {status.authenticated ? (
            <button
              onClick={handleDisconnectGoogle}
              className="btn-washi"
              style={{ color: '#EF4444', borderColor: '#FCA5A5' }}
            >
              Ngắt kết nối
            </button>
          ) : (
            <button onClick={handleConnectGoogle} className="btn-matcha">
              🔑 Kết nối tài khoản Google
            </button>
          )}
        </div>
      </section>

      {/* 3. BENTO GRID: 3 TIỆN ÍCH GOOGLE WORKSPACE */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
        {/* CARD 1: GOOGLE SHEETS */}
        <div
          className="card-karuta"
          style={{
            padding: '2rem',
            background: 'var(--washi-surface)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '0.2rem 0.6rem',
                    background: 'rgba(16, 185, 129, 0.12)',
                    color: '#059669',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-maru)',
                    marginBottom: '0.5rem',
                  }}
                >
                  表計算 · GOOGLE SHEETS
                </span>
                <h3 style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.25rem', color: 'var(--sumi-ink)', fontWeight: 700 }}>
                  Bảng tính Từ vựng
                </h3>
              </div>
              <div className="inkan-stamp-badge" title="Google Sheets">
                表
              </div>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--sumi-faded)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Xuất toàn bộ 484 thẻ học (kèm độ ổn định FSRS) sang Google Sheets cá nhân, hoặc nhập danh sách từ mới từ bảng tính có sẵn.
            </p>

            {/* Action 1: Export */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              <button
                onClick={handleExportSheet}
                disabled={loading || !status.authenticated}
                className="btn-matcha"
                style={{ flex: 1, padding: '0.65rem 1rem', fontSize: '0.85rem' }}
                title={!status.authenticated ? 'Cần kết nối Google để xuất trực tiếp' : ''}
              >
                📊 Tạo Google Sheet mới
              </button>
              <button
                onClick={handleDownloadCsv}
                className="btn-washi"
                style={{ padding: '0.65rem 1rem', fontSize: '0.85rem' }}
                title="Tải file CSV tương thích 100% với Google Drive & Excel (Không cần kết nối)"
              >
                💾 Tải file CSV
              </button>
            </div>

            {/* Action 2: Import */}
            <div style={{ borderTop: '1px dashed var(--washi-border)', paddingTop: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--sumi-charcoal)', marginBottom: '0.4rem' }}>
                Nhập từ Google Sheet:
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Paste link hoặc ID bảng tính..."
                  value={sheetUrl}
                  onChange={(e) => setSheetUrl(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--washi-border)',
                    fontSize: '0.85rem',
                    background: '#FFFFFF',
                  }}
                />
                <button
                  onClick={handlePreviewSheet}
                  disabled={loading || !sheetUrl.trim()}
                  className="btn-washi"
                  style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}
                >
                  Đọc Sheet
                </button>
              </div>
            </div>

            {/* Preview table if available */}
            {sheetPreview.length > 0 && (
              <div style={{ marginTop: '1rem', background: '#F8FAF2', padding: '0.75rem', borderRadius: '8px', border: '1px solid #D1FAE5' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--matcha-deep)', margin: '0 0 0.5rem' }}>
                  Tìm thấy {sheetPreview.length} từ vựng xem trước:
                </p>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.8rem', color: 'var(--sumi-charcoal)' }}>
                  {sheetPreview.slice(0, 3).map((item, idx) => (
                    <li key={idx}>
                      <strong>{item.kanji}</strong> ({item.reading}): {item.meaning}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleExecuteImport}
                  disabled={loading}
                  className="btn-matcha"
                  style={{ marginTop: '0.75rem', width: '100%', padding: '0.5rem', fontSize: '0.82rem' }}
                >
                  🚀 Xác nhận nạp vào Database
                </button>
              </div>
            )}

            {sheetMessage && (
              <p style={{ marginTop: '0.75rem', fontSize: '0.82rem', color: sheetMessage.includes('❌') ? '#DC2626' : '#059669' }}>
                {sheetMessage}
              </p>
            )}
          </div>
        </div>

        {/* CARD 2: GOOGLE CALENDAR */}
        <div
          className="card-karuta"
          style={{
            padding: '2rem',
            background: 'var(--washi-surface)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
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
                  予定表 · GOOGLE CALENDAR
                </span>
                <h3 style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.25rem', color: 'var(--sumi-ink)', fontWeight: 700 }}>
                  Lịch nhắc ôn tập FSRS
                </h3>
              </div>
              <div className="inkan-stamp-badge" title="Google Calendar" style={{ borderColor: 'var(--torii-red)', color: 'var(--torii-red)' }}>
                暦
              </div>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--sumi-faded)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Tạo sự kiện nhắc nhở học ngắt quãng hàng ngày trên Google Calendar, kèm đường link vào học ngay trên điện thoại hoặc máy tính.
            </p>

            {/* Time Selector */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--sumi-charcoal)', marginBottom: '0.4rem' }}>
                Khung giờ học mỗi ngày:
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="time"
                  value={studyTime}
                  onChange={(e) => setStudyTime(e.target.value)}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--washi-border)',
                    fontSize: '0.95rem',
                    fontFamily: 'var(--font-maru)',
                    fontWeight: 600,
                  }}
                />
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', color: 'var(--sumi-charcoal)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={recurDaily}
                    onChange={(e) => setRecurDaily(e.target.checked)}
                  />
                  Lặp lại hàng ngày
                </label>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '1.25rem' }}>
              <button
                onClick={handleCalendarQuickAdd}
                className="btn-torii"
                style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem' }}
              >
                ⚡ 1-Click Thêm vào Google Calendar
              </button>
              <p style={{ fontSize: '0.75rem', color: 'var(--sumi-faded)', margin: 0, textAlign: 'center' }}>
                💡 Hoạt động tức thì trên trình duyệt / điện thoại mà không cần cấp quyền!
              </p>

              {status.authenticated && (
                <button
                  onClick={handleCalendarApiSync}
                  disabled={loading}
                  className="btn-washi"
                  style={{ width: '100%', padding: '0.6rem', fontSize: '0.85rem', marginTop: '0.25rem' }}
                >
                  🔄 Tự động đồng bộ qua Calendar API
                </button>
              )}
            </div>

            {calendarMessage && (
              <p style={{ marginTop: '0.75rem', fontSize: '0.82rem', color: calendarMessage.includes('❌') ? '#DC2626' : '#059669' }}>
                {calendarMessage}
              </p>
            )}
          </div>
        </div>

        {/* CARD 3: GOOGLE TASKS / TODO LIST */}
        <div
          className="card-karuta"
          style={{
            padding: '2rem',
            background: 'var(--washi-surface)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
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
                  任務 · GOOGLE TASKS
                </span>
                <h3 style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.25rem', color: 'var(--sumi-ink)', fontWeight: 700 }}>
                  To-Do List Hàng ngày
                </h3>
              </div>
              <div className="inkan-stamp-badge" title="Google Tasks" style={{ borderColor: '#D97706', color: '#D97706' }}>
                務
              </div>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--sumi-faded)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Đồng bộ mục tiêu quyết tâm của búp bê Daruma vào danh sách Google Tasks để hiển thị trên widget màn hình chính điện thoại và thanh bên Gmail.
            </p>

            <div style={{ background: '#FFFDF5', padding: '1rem', borderRadius: '12px', border: '1px solid #FEF3C7', marginBottom: '1.25rem' }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#B45309', margin: '0 0 0.5rem' }}>
                Nhiệm vụ hôm nay sẽ đẩy vào Tasks:
              </p>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--sumi-charcoal)', lineHeight: 1.6 }}>
                <li>▫️ <strong>[FSRS]</strong> Ôn tập 15 thẻ đến hạn hôm nay</li>
                <li>▫️ <strong>[FSRS]</strong> Nạp 5 từ vựng mới chuẩn i+1</li>
              </ul>
            </div>

            <button
              onClick={handleSyncTasks}
              disabled={loading || !status.authenticated}
              className="btn-matcha"
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.9rem',
                opacity: status.authenticated ? 1 : 0.6,
              }}
              title={!status.authenticated ? 'Cần kết nối Google trước' : ''}
            >
              📝 Đẩy mục tiêu vào Google Tasks
            </button>

            {!status.authenticated && (
              <p style={{ fontSize: '0.75rem', color: 'var(--sumi-faded)', marginTop: '0.5rem', textAlign: 'center' }}>
                (Cần bấm "Kết nối tài khoản Google" ở trên để sử dụng)
              </p>
            )}

            {taskMessage && (
              <p style={{ marginTop: '0.75rem', fontSize: '0.82rem', color: taskMessage.includes('❌') ? '#DC2626' : '#059669' }}>
                {taskMessage}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 4. HƯỚNG DẪN CẤU HÌNH GOOGLE OAUTH 2.0 */}
      <section
        style={{
          marginTop: '3rem',
          background: 'var(--washi-surface)',
          border: '1px solid var(--washi-border)',
          borderRadius: '16px',
          padding: '1.75rem 2rem',
          boxShadow: 'var(--shadow-washi-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <ToriiIcon size={24} color="var(--torii-red)" />
          <h3 style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.15rem', color: 'var(--sumi-ink)', fontWeight: 700, margin: 0 }}>
            Hướng dẫn thiết lập Google OAuth 2.0 (Nếu muốn đồng bộ 2 chiều tự động)
          </h3>
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--sumi-faded)', lineHeight: 1.6 }}>
          Để kết nối Google Sheets, Calendar và Tasks tự động bằng tài khoản của bạn, bạn có thể tạo bộ mã Client ID &amp; Secret miễn phí:
        </p>
        <ol style={{ fontSize: '0.85rem', color: 'var(--sumi-charcoal)', lineHeight: 1.8, paddingLeft: '1.25rem', margin: '0.5rem 0' }}>
          <li>Truy cập <a href="https://console.cloud.google.com" target="_blank" rel="noreferrer" style={{ color: 'var(--asagi-teal)' }}>Google Cloud Console</a> và tạo một Project mới (miễn phí).</li>
          <li>Vào <strong>APIs &amp; Services &gt; Library</strong>, bật 3 API: <em>Google Sheets API</em>, <em>Google Calendar API</em>, và <em>Google Tasks API</em>.</li>
          <li>Vào <strong>Credentials &gt; Create Credentials &gt; OAuth client ID</strong> (Chọn loại <em>Web application</em>).</li>
          <li>Thêm Redirect URI: <code>http://localhost:3000/api/google/callback</code> (hoặc domain Vercel của bạn).</li>
          <li>Dán <code>GOOGLE_CLIENT_ID</code> và <code>GOOGLE_CLIENT_SECRET</code> vào file <code>.env</code> của dự án.</li>
        </ol>
      </section>
    </main>
  );
}
