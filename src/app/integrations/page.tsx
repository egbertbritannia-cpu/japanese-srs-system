'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  const [connecting, setConnecting] = useState(false);
  const [copiedUri, setCopiedUri] = useState(false);

  // Fetch status on load & capture query params
  useEffect(() => {
    fetchStatus();
  }, []);

  function handleCopyUri() {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText('https://japanese-srs-system-git-main-cassius1.vercel.app/api/google/callback');
      setCopiedUri(true);
      setTimeout(() => setCopiedUri(false), 2500);
    }
  }

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

  async function handlePasteSheetUrl() {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setSheetUrl(text.trim());
        }
      }
    } catch (e) {
      console.error('Không thể đọc từ clipboard:', e);
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
        setSheetMessage(`Đã xuất thành công ${data.rowCount} thẻ sang Google Sheets!`);
        window.open(data.spreadsheetUrl, '_blank');
      } else {
        setSheetMessage(data.error || 'Lỗi khi tạo Google Sheet');
      }
    } catch (e: any) {
      setSheetMessage(`Lỗi kết nối: ${e.message}`);
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
        setSheetMessage(`Tìm thấy ${data.rowCount} dòng dữ liệu hợp lệ.`);
      } else {
        setSheetMessage(data.error || 'Không thể đọc dữ liệu từ Sheet');
      }
    } catch (e: any) {
      setSheetMessage(`Lỗi: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleExecuteImport() {
    if (!sheetUrl.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/google/sheets/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urlOrId: sheetUrl, action: 'import' }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`Đã nạp thành công ${data.importedCount} thẻ vào hệ thống!`);
        setSheetPreview([]);
        setSheetUrl('');
        setSheetMessage(null);
      } else {
        alert(data.error || 'Lỗi khi nạp dữ liệu');
      }
    } catch {
      alert('Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  }

  // 2. Google Calendar
  function handleCalendarQuickAdd() {
    const title = encodeURIComponent('Ôn tập tiếng Nhật FSRS (484 thẻ)');
    const details = encodeURIComponent(
      'Phiên học ngắt quãng FSRS hàng ngày giúp củng cố trí nhớ dài hạn.\nĐường link vào học: https://japanese-srs-system.vercel.app/review'
    );
    const [h, m] = studyTime.split(':');
    const startHour = h || '20';
    const startMin = m || '00';
    const now = new Date();
    const y = now.getFullYear();
    const mo = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');

    const dtStart = `${y}${mo}${d}T${startHour}${startMin}00`;
    const endH = String((parseInt(startHour, 10) + 1) % 24).padStart(2, '0');
    const dtEnd = `${y}${mo}${d}T${endH}${startMin}00`;

    let url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${dtStart}/${dtEnd}`;
    if (recurDaily) {
      url += '&recur=RRULE:FREQ=DAILY';
    }
    window.open(url, '_blank');
  }

  async function handleCalendarApiSync() {
    setLoading(true);
    setCalendarMessage(null);
    try {
      const res = await fetch('/api/google/calendar/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ time: studyTime, studyTime, recurDaily, mode: 'api_sync' }),
      });
      const data = await res.json();
      if (data.success) {
        setCalendarMessage(`Đã tạo lịch học thành công trên Google Calendar!`);
      } else {
        setCalendarMessage(data.error || 'Lỗi đồng bộ Calendar');
      }
    } catch (e: any) {
      setCalendarMessage(`Lỗi: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  // 3. Google Tasks
  async function handleSyncTasks() {
    setLoading(true);
    setTaskMessage(null);
    try {
      const res = await fetch('/api/google/tasks/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tasks: [
            { title: 'Ôn tập thẻ tiếng Nhật đến hạn FSRS', dueOffsetDays: 0 },
            { title: 'Học 5 chữ Hán / từ vựng mới', dueOffsetDays: 0 },
          ],
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTaskMessage(`Đã thêm thành công các nhiệm vụ học vào Google Tasks!`);
      } else {
        setTaskMessage(data.error || 'Lỗi đồng bộ Tasks');
      }
    } catch (e: any) {
      setTaskMessage(`Lỗi: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: '1080px', margin: '1.5rem auto', padding: '0 1.25rem 4rem' }}>
      {/* Floating Toast Notification (VIS-INT-04) */}
      {copiedUri && (
        <div
          style={{
            position: 'fixed',
            top: '2rem',
            right: '2rem',
            zIndex: 1000,
            background: 'linear-gradient(135deg, #1E4B75 0%, #0A1C33 100%)',
            color: '#FAF8F5',
            border: '1.5px solid #C89B58',
            borderRadius: '12px',
            padding: '0.85rem 1.35rem',
            boxShadow: '0 8px 30px rgba(18, 36, 56, 0.25)',
            fontSize: '0.9rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <span>✨</span>
          <span>Đã sao chép liên kết điều hướng an toàn vào bộ nhớ tạm!</span>
        </div>
      )}

      {/* 1. HEADER NGHỆ THUẬT SÓNG ĐÊM VÀNG (NIGHT GOLDEN WAVES) */}
      <section
        style={{
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          padding: 'clamp(2rem, 4vw, 2.75rem) clamp(1.5rem, 3.5vw, 2.5rem)',
          marginBottom: '2rem',
          border: '1.5px solid #C89B58',
          boxShadow: '0 12px 36px rgba(18, 36, 56, 0.12)',
          background: 'linear-gradient(135deg, #091829 0%, #112842 55%, #0C1E34 100%)',
          color: '#FFFFFF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, opacity: 0.32, pointerEvents: 'none', zIndex: 0 }}>
          <Image
            src="/assets/art/night-golden-waves.jpg"
            alt="Sóng vàng đêm nghệ thuật Rinpa"
            fill
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '640px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-mincho)',
                background: '#C83824',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.78rem',
                padding: '0.2rem 0.65rem',
                borderRadius: '6px',
                letterSpacing: '0.08em',
              }}
            >
              連係網 · TIỆN ÍCH
            </span>
            <span style={{ fontSize: '0.84rem', color: '#E8D9BD', fontFamily: 'var(--font-maru)' }}>
              Đồng bộ hệ sinh thái Google Workspace &amp; Turso Edge
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-mincho)',
              fontSize: 'clamp(1.8rem, 4vw, 2.35rem)',
              fontWeight: 900,
              lineHeight: 1.25,
              margin: '0 0 0.5rem 0',
              textShadow: '0 2px 6px rgba(0, 0, 0, 0.4)',
            }}
          >
            Đồng bộ Bảng tính &amp; Lịch học FSRS
          </h1>

          <p style={{ color: 'rgba(250, 248, 245, 0.9)', fontSize: '0.92rem', lineHeight: 1.6, margin: '0 0 1.25rem 0' }}>
            Kết nối ứng dụng học tiếng Nhật với Google Calendar để nhắc nhở giờ ôn tập mỗi ngày, đồng bộ từ vựng 2 chiều qua Google Sheets và theo dõi mục tiêu học tập qua Google Tasks.
          </p>

          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: '#FFFFFF',
              textDecoration: 'none',
              fontSize: '0.88rem',
              fontFamily: 'var(--font-maru)',
              fontWeight: 600,
              padding: '0.5rem 1rem',
              background: 'rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              transition: 'background 0.2s ease',
            }}
          >
            ← Quay lại Trang chủ
          </Link>
        </div>

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
              border: '1.5px solid rgba(200, 155, 88, 0.5)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            }}
          >
            <OrizuruIcon size={42} color="#FFFFFF" />
          </div>
        </div>
      </section>

      {/* 2. THE 4-PILLAR INTEGRATION BENTO GRID (VIS-INT-01) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* PILLAR 1: HERO STATUS & OAUTH CARD (VIS-INT-02, VIS-INT-04) */}
        <div
          style={{
            gridColumn: '1 / -1',
            background: '#FFFFFF',
            border: '1.5px solid var(--washi-border, #E6E1DA)',
            borderRadius: '20px',
            padding: '1.5rem 1.75rem',
            boxShadow: '0 6px 20px rgba(18, 36, 56, 0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.25rem',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Real-time Pulse Glow LED (VIS-INT-02) */}
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: status.authenticated ? '#EBF5EE' : '#FAF6EE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1.5px solid ${status.authenticated ? '#10B981' : '#C89B58'}`,
                position: 'relative',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: status.authenticated ? '#10B981' : '#C89B58',
                  boxShadow: status.authenticated ? '0 0 12px #10B981, 0 0 20px rgba(16, 185, 129, 0.5)' : 'none',
                }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <h3 style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.15rem', color: '#122438', fontWeight: 800, margin: 0 }}>
                  {status.authenticated ? `Đã kết nối: ${status.userEmail || 'Tài khoản Google'}` : 'Chế độ hoạt động độc lập (Không cần đăng nhập)'}
                </h3>
                {status.authenticated && (
                  <span
                    style={{
                      padding: '0.15rem 0.5rem',
                      background: '#EBF5EE',
                      color: '#10B981',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      border: '1px solid #A7F3D0',
                    }}
                  >
                    ● REAL-TIME ACTIVE
                  </span>
                )}
              </div>
              <p style={{ fontSize: '0.84rem', color: '#786A5E', margin: '0.25rem 0 0', lineHeight: 1.4 }}>
                {status.authenticated
                  ? 'Đã sẵn sàng đồng bộ 2 chiều tự động với hệ thống đám mây.'
                  : 'Bạn vẫn có thể xuất file CSV, thêm sự kiện vào Google Calendar ngay trên trình duyệt mà không cần tài khoản!'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Copy Redirect URI Button with Toast (VIS-INT-04) */}
            <button
              type="button"
              onClick={handleCopyUri}
              style={{
                padding: '0.55rem 0.95rem',
                borderRadius: '10px',
                border: '1.2px solid #E6DDCF',
                background: '#FAF8F5',
                color: '#122438',
                fontSize: '0.82rem',
                fontFamily: 'var(--font-maru)',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <span>📋</span> Sao chép Redirect URI
            </button>

            {status.authenticated ? (
              <button
                onClick={handleDisconnectGoogle}
                style={{
                  padding: '0.55rem 1.15rem',
                  borderRadius: '10px',
                  border: '1.2px solid #F5C6CB',
                  background: '#FFF2F0',
                  color: '#C83824',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-maru)',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Ngắt kết nối
              </button>
            ) : (
              <a
                href="/api/google/auth-redirect"
                className="btn-torii"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  textDecoration: 'none',
                  padding: '0.6rem 1.35rem',
                  fontSize: '0.88rem',
                  borderRadius: '10px',
                  boxShadow: '0 4px 14px rgba(200, 56, 36, 0.25)',
                }}
                onClick={() => setConnecting(true)}
              >
                {connecting ? 'Đang chuyển hướng...' : 'Kết nối Google'}
              </a>
            )}
          </div>
        </div>

        {/* PILLAR 2: GOOGLE SHEETS CARD (VIS-INT-03) */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            border: '1.5px solid var(--washi-border, #E6E1DA)',
            padding: '1.75rem',
            boxShadow: '0 6px 20px rgba(18, 36, 56, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <JapaneseArtBackdrop
            src="/assets/art/ryusui-indigo-stream.jpg"
            alt="Dòng chảy Ryusui"
            opacity={0.05}
            blendMode="multiply"
            objectPosition="bottom right"
          />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ marginBottom: '0.85rem' }}>
              <span
                style={{
                  display: 'inline-block',
                  padding: '0.2rem 0.6rem',
                  background: '#EDF4FA',
                  color: '#1E4B75',
                  borderRadius: '6px',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-maru)',
                  marginBottom: '0.4rem',
                }}
              >
                GOOGLE SHEETS
              </span>
              <h3 style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.25rem', color: '#122438', fontWeight: 800, margin: 0 }}>
                Bảng tính Từ vựng 2 Chiều
              </h3>
            </div>

            <p style={{ fontSize: '0.88rem', color: '#786A5E', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Xuất toàn bộ thẻ học kèm thông số FSRS sang Google Sheets hoặc tải tệp CSV tương thích mọi thiết bị.
            </p>

            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
              <button
                onClick={handleExportSheet}
                disabled={loading || !status.authenticated}
                className="btn-torii"
                style={{
                  flex: 1,
                  padding: '0.6rem 1rem',
                  fontSize: '0.85rem',
                  opacity: status.authenticated ? 1 : 0.6,
                  borderRadius: '10px',
                }}
              >
                Xuất Google Sheet
              </button>
              <button
                onClick={handleDownloadCsv}
                style={{
                  padding: '0.6rem 1rem',
                  fontSize: '0.85rem',
                  borderRadius: '10px',
                  border: '1.2px solid #E6DDCF',
                  background: '#FAF8F5',
                  color: '#122438',
                  fontFamily: 'var(--font-maru)',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Tải file CSV
              </button>
            </div>

            {/* Nhập từ Sheet với nút Dán nhanh (VIS-INT-03) */}
            <div style={{ borderTop: '1px dashed #ECE4D6', paddingTop: '1.15rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#122438' }}>
                  Nhập từ Google Sheet công khai:
                </label>
                <button
                  type="button"
                  onClick={handlePasteSheetUrl}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#1E4B75',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: 0,
                  }}
                >
                  📋 Dán từ Clipboard
                </button>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Dán link Google Sheet hoặc Spreadsheet ID..."
                  value={sheetUrl}
                  onChange={(e) => setSheetUrl(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.55rem 0.85rem',
                    borderRadius: '10px',
                    border: '1.2px solid #E6DDCF',
                    fontSize: '0.86rem',
                    background: '#FFFFFF',
                  }}
                />
                <button
                  onClick={handlePreviewSheet}
                  disabled={loading || !sheetUrl.trim()}
                  style={{
                    padding: '0.55rem 0.95rem',
                    fontSize: '0.84rem',
                    borderRadius: '10px',
                    border: '1.2px solid #1B4268',
                    background: '#1B4268',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Đọc Sheet
                </button>
              </div>
            </div>

            {/* Formatted Preview Table (VIS-INT-03) */}
            {sheetPreview.length > 0 && (
              <div style={{ marginTop: '1rem', background: '#FAFAF9', padding: '1rem', borderRadius: '12px', border: '1px solid #E6DDCF' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#2A6B3D', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Tìm thấy {sheetPreview.length} dòng dữ liệu xem trước:</span>
                  <span style={{ color: '#888' }}>Top 3 mẫu</span>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #E6DDCF', color: '#8B7B6D' }}>
                        <th style={{ padding: '0.35rem 0.5rem' }}>Hán tự</th>
                        <th style={{ padding: '0.35rem 0.5rem' }}>Cách đọc</th>
                        <th style={{ padding: '0.35rem 0.5rem' }}>Ý nghĩa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sheetPreview.slice(0, 3).map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px dashed #ECE8E1' }}>
                          <td style={{ padding: '0.4rem 0.5rem', fontWeight: 800, fontFamily: 'var(--font-mincho)' }}>{item.kanji}</td>
                          <td style={{ padding: '0.4rem 0.5rem', color: '#2A6B3D' }}>{item.reading}</td>
                          <td style={{ padding: '0.4rem 0.5rem', color: '#555' }}>{item.meaning}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  onClick={handleExecuteImport}
                  disabled={loading}
                  className="btn-torii"
                  style={{ marginTop: '0.85rem', width: '100%', padding: '0.6rem', fontSize: '0.85rem', borderRadius: '10px' }}
                >
                  Xác nhận nạp vào Database
                </button>
              </div>
            )}

            {sheetMessage && (
              <p style={{ marginTop: '0.75rem', fontSize: '0.82rem', color: '#122438', background: '#F0F9F2', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
                {sheetMessage}
              </p>
            )}
          </div>
        </div>

        {/* PILLAR 3: GOOGLE CALENDAR CARD (VIS-INT-05: Zen Time Picker) */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            border: '1.5px solid var(--washi-border, #E6E1DA)',
            padding: '1.75rem',
            boxShadow: '0 6px 20px rgba(18, 36, 56, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ marginBottom: '0.85rem' }}>
              <span
                style={{
                  display: 'inline-block',
                  padding: '0.2rem 0.6rem',
                  background: '#EDF4FA',
                  color: '#1E4B75',
                  borderRadius: '6px',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-maru)',
                  marginBottom: '0.4rem',
                }}
              >
                GOOGLE CALENDAR
              </span>
              <h3 style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.25rem', color: '#122438', fontWeight: 800, margin: 0 }}>
                Lịch nhắc ôn tập FSRS
              </h3>
            </div>

            <p style={{ fontSize: '0.88rem', color: '#786A5E', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Tạo sự kiện nhắc nhở học ngắt quãng hàng ngày trên Google Calendar kèm liên kết truy cập nhanh.
            </p>

            {/* Zen Quick Presets (VIS-INT-05) */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#122438', marginBottom: '0.45rem' }}>
                Khung giờ học nhanh:
              </label>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                {[
                  { label: '🌅 07:00', val: '07:00' },
                  { label: '☀️ 12:30', val: '12:30' },
                  { label: '🏮 20:00', val: '20:00' },
                  { label: '🌙 22:00', val: '22:00' },
                ].map((preset) => (
                  <button
                    key={preset.val}
                    type="button"
                    onClick={() => setStudyTime(preset.val)}
                    style={{
                      padding: '0.35rem 0.65rem',
                      borderRadius: '8px',
                      border: studyTime === preset.val ? '1.5px solid #1E4B75' : '1px solid #E6DDCF',
                      background: studyTime === preset.val ? '#EDF4FA' : '#FAFAF9',
                      color: studyTime === preset.val ? '#1E4B75' : '#555',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                <input
                  type="time"
                  value={studyTime}
                  onChange={(e) => setStudyTime(e.target.value)}
                  style={{
                    padding: '0.55rem 0.85rem',
                    borderRadius: '10px',
                    border: '1.2px solid #E6DDCF',
                    fontSize: '0.95rem',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontWeight: 700,
                    color: '#122438',
                    background: '#FFFFFF',
                  }}
                />
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', color: '#786A5E', cursor: 'pointer', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={recurDaily}
                    onChange={(e) => setRecurDaily(e.target.checked)}
                    style={{ accentColor: '#1E4B75' }}
                  />
                  Lặp lại mỗi ngày
                </label>
              </div>
            </div>

            <button
              onClick={handleCalendarQuickAdd}
              className="btn-torii"
              style={{ width: '100%', padding: '0.75rem', fontSize: '0.88rem', borderRadius: '10px' }}
            >
              Thêm vào Google Calendar ➔
            </button>

            {calendarMessage && (
              <p style={{ marginTop: '0.75rem', fontSize: '0.82rem', color: '#122438', background: '#F0F9F2', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
                {calendarMessage}
              </p>
            )}
          </div>
        </div>

        {/* PILLAR 4: GOOGLE TASKS CARD */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            border: '1.5px solid var(--washi-border, #E6E1DA)',
            padding: '1.75rem',
            boxShadow: '0 6px 20px rgba(18, 36, 56, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ marginBottom: '0.85rem' }}>
              <span
                style={{
                  display: 'inline-block',
                  padding: '0.2rem 0.6rem',
                  background: '#EDF4FA',
                  color: '#1E4B75',
                  borderRadius: '6px',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-maru)',
                  marginBottom: '0.4rem',
                }}
              >
                GOOGLE TASKS
              </span>
              <h3 style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.25rem', color: '#122438', fontWeight: 800, margin: 0 }}>
                Nhiệm vụ hàng ngày
              </h3>
            </div>

            <p style={{ fontSize: '0.88rem', color: '#786A5E', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Đồng bộ mục tiêu học tập FSRS vào danh sách Google Tasks để hiển thị trên điện thoại và thanh bên Gmail.
            </p>

            <button
              onClick={handleSyncTasks}
              disabled={loading || !status.authenticated}
              className="btn-torii"
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.88rem',
                borderRadius: '10px',
                opacity: status.authenticated ? 1 : 0.6,
              }}
            >
              Đồng bộ vào Google Tasks
            </button>

            {taskMessage && (
              <p style={{ marginTop: '0.75rem', fontSize: '0.82rem', color: '#122438', background: '#F0F9F2', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
                {taskMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
