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
    <main style={{ maxWidth: '980px', margin: '1.5rem auto', padding: '0 1.25rem 3.5rem' }}>
      {/* 1. HEADER NGHỆ THUẬT SÓNG ĐÊM VÀNG (NIGHT GOLDEN WAVES) */}
      <section
        style={{
          position: 'relative',
          borderRadius: '20px',
          overflow: 'hidden',
          padding: '2.5rem 2.25rem',
          marginBottom: '1.75rem',
          border: '1.5px solid #C89B58',
          boxShadow: '0 12px 32px rgba(18, 36, 56, 0.1)',
          background: 'linear-gradient(135deg, #091829 0%, #112842 55%, #0C1E34 100%)',
          color: '#FFFFFF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        {/* Lớp nền sóng vàng đêm nghệ thuật */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.32, pointerEvents: 'none', zIndex: 0 }}>
          <Image
            src="/assets/art/night-golden-waves.jpg"
            alt="Sóng vàng đêm nghệ thuật Rinpa"
            fill
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '620px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-mincho)',
                background: '#C83824',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.78rem',
                padding: '0.2rem 0.65rem',
                borderRadius: '4px',
                letterSpacing: '0.08em',
              }}
            >
              連係網 · TIỆN ÍCH
            </span>
            <span style={{ fontSize: '0.82rem', color: '#E8D9BD', fontFamily: 'var(--font-maru)' }}>
              Đồng bộ hệ sinh thái Google Workspace
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-mincho)',
              fontSize: '2.2rem',
              fontWeight: 800,
              lineHeight: 1.25,
              margin: '0 0 0.5rem 0',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            }}
          >
            Đồng bộ Bảng tính &amp; Lịch học FSRS
          </h1>

          <p style={{ color: 'rgba(250, 248, 245, 0.9)', fontSize: '0.92rem', lineHeight: 1.5, margin: '0 0 1.25rem 0' }}>
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
            }}
          >
            ← Quay lại Trang chủ
          </Link>
        </div>

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(8px)',
              border: '1.2px solid rgba(200, 155, 88, 0.5)',
            }}
          >
            <OrizuruIcon size={38} color="#FFFFFF" />
          </div>
        </div>
      </section>

      {/* 2. TRẠNG THÁI KẾT NỐI TÀI KHOẢN GOOGLE */}
      <section
        style={{
          background: '#FAF7F0',
          border: '1.2px solid #E6DDCF',
          borderRadius: '16px',
          padding: '1.35rem 1.75rem',
          marginBottom: '1.75rem',
          boxShadow: '0 4px 14px rgba(18, 36, 56, 0.04)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: status.authenticated ? '#EBF5EE' : '#FAF6EE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1.2px solid ${status.authenticated ? '#3E734E' : '#C89B58'}`,
              fontFamily: 'var(--font-mincho)',
              fontWeight: 800,
              fontSize: '1rem',
              color: status.authenticated ? '#3E734E' : '#122438',
            }}
          >
            {status.authenticated ? '連' : '雲'}
          </div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.1rem', color: '#122438', fontWeight: 700, margin: 0 }}>
              {status.authenticated ? `Đã kết nối: ${status.userEmail || 'Tài khoản Google'}` : 'Chế độ hoạt động độc lập (Không cần đăng nhập)'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#786A5E', margin: '0.2rem 0 0' }}>
              {status.authenticated
                ? 'Đã sẵn sàng đồng bộ 2 chiều tự động.'
                : 'Bạn vẫn có thể xuất file CSV, thêm sự kiện vào Google Calendar ngay trên trình duyệt mà không cần tài khoản!'}
            </p>
          </div>
        </div>

        <div>
          {status.authenticated ? (
            <button
              onClick={handleDisconnectGoogle}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: '1.2px solid #E6DDCF',
                background: '#FFFFFF',
                color: '#C83824',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-maru)',
                fontWeight: 600,
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
                padding: '0.55rem 1.15rem',
                fontSize: '0.85rem',
                boxShadow: '0 4px 12px rgba(200, 56, 36, 0.25)',
              }}
              onClick={() => setConnecting(true)}
            >
              {connecting ? 'Đang chuyển hướng...' : 'Kết nối Google'}
            </a>
          )}
        </div>
      </section>

      {/* 3. BENTO GRID: 3 TIỆN ÍCH GOOGLE WORKSPACE */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* CARD 1: GOOGLE SHEETS */}
        <div
          style={{
            padding: '1.75rem',
            background: '#FAF7F0',
            borderRadius: '16px',
            border: '1.2px solid #E6DDCF',
            boxShadow: '0 4px 14px rgba(18, 36, 56, 0.04)',
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
            opacity={0.08}
            blendMode="multiply"
            objectPosition="bottom right"
          />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
              <div>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '0.2rem 0.55rem',
                    background: '#EDF4FA',
                    color: '#1E4B75',
                    borderRadius: '4px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-maru)',
                    marginBottom: '0.4rem',
                  }}
                >
                  GOOGLE SHEETS
                </span>
                <h3 style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.2rem', color: '#122438', fontWeight: 700, margin: 0 }}>
                  Bảng tính Từ vựng
                </h3>
              </div>
            </div>

            <p style={{ fontSize: '0.86rem', color: '#786A5E', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Xuất toàn bộ thẻ học kèm thông số FSRS sang Google Sheets hoặc tải tệp CSV tương thích mọi thiết bị.
            </p>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
              <button
                onClick={handleExportSheet}
                disabled={loading || !status.authenticated}
                className="btn-torii"
                style={{
                  flex: 1,
                  padding: '0.55rem 0.85rem',
                  fontSize: '0.84rem',
                  opacity: status.authenticated ? 1 : 0.6,
                }}
              >
                Xuất Google Sheet
              </button>
              <button
                onClick={handleDownloadCsv}
                style={{
                  padding: '0.55rem 0.85rem',
                  fontSize: '0.84rem',
                  borderRadius: '8px',
                  border: '1.2px solid #E6DDCF',
                  background: '#FFFFFF',
                  color: '#122438',
                  fontFamily: 'var(--font-maru)',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Tải file CSV
              </button>
            </div>

            {/* Nhập từ Sheet */}
            <div style={{ borderTop: '1px solid #ECE4D6', paddingTop: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#122438', marginBottom: '0.35rem' }}>
                Nhập từ Google Sheet công khai:
              </label>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <input
                  type="text"
                  placeholder="Dán link hoặc ID Google Sheet..."
                  value={sheetUrl}
                  onChange={(e) => setSheetUrl(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #E6DDCF',
                    fontSize: '0.84rem',
                    background: '#FFFFFF',
                  }}
                />
                <button
                  onClick={handlePreviewSheet}
                  disabled={loading || !sheetUrl.trim()}
                  style={{
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.82rem',
                    borderRadius: '8px',
                    border: '1.2px solid #E6DDCF',
                    background: '#FFFFFF',
                    color: '#122438',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Đọc Sheet
                </button>
              </div>
            </div>

            {sheetPreview.length > 0 && (
              <div style={{ marginTop: '0.85rem', background: '#FFFFFF', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E6DDCF' }}>
                <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#3E734E', margin: '0 0 0.35rem' }}>
                  Tìm thấy {sheetPreview.length} từ vựng xem trước:
                </p>
                <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.78rem', color: '#122438' }}>
                  {sheetPreview.slice(0, 3).map((item, idx) => (
                    <li key={idx}>
                      <strong>{item.kanji}</strong> ({item.reading}): {item.meaning}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleExecuteImport}
                  disabled={loading}
                  className="btn-torii"
                  style={{ marginTop: '0.65rem', width: '100%', padding: '0.45rem', fontSize: '0.8rem' }}
                >
                  Xác nhận nạp vào Database
                </button>
              </div>
            )}

            {sheetMessage && (
              <p style={{ marginTop: '0.65rem', fontSize: '0.8rem', color: '#122438' }}>
                {sheetMessage}
              </p>
            )}
          </div>
        </div>

        {/* CARD 2: GOOGLE CALENDAR */}
        <div
          style={{
            padding: '1.75rem',
            background: '#FAF7F0',
            borderRadius: '16px',
            border: '1.2px solid #E6DDCF',
            boxShadow: '0 4px 14px rgba(18, 36, 56, 0.04)',
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
                  padding: '0.2rem 0.55rem',
                  background: '#EDF4FA',
                  color: '#1E4B75',
                  borderRadius: '4px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-maru)',
                  marginBottom: '0.4rem',
                }}
              >
                GOOGLE CALENDAR
              </span>
              <h3 style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.2rem', color: '#122438', fontWeight: 700, margin: 0 }}>
                Lịch nhắc ôn tập FSRS
              </h3>
            </div>

            <p style={{ fontSize: '0.86rem', color: '#786A5E', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Tạo sự kiện nhắc nhở học ngắt quãng hàng ngày trên Google Calendar kèm liên kết truy cập nhanh.
            </p>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#122438', marginBottom: '0.35rem' }}>
                Khung giờ học mỗi ngày:
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="time"
                  value={studyTime}
                  onChange={(e) => setStudyTime(e.target.value)}
                  style={{
                    padding: '0.45rem 0.65rem',
                    borderRadius: '8px',
                    border: '1px solid #E6DDCF',
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-maru)',
                    fontWeight: 600,
                  }}
                />
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: '#786A5E', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={recurDaily}
                    onChange={(e) => setRecurDaily(e.target.checked)}
                  />
                  Lặp lại mỗi ngày
                </label>
              </div>
            </div>

            <button
              onClick={handleCalendarQuickAdd}
              className="btn-torii"
              style={{ width: '100%', padding: '0.65rem', fontSize: '0.85rem' }}
            >
              Thêm vào Google Calendar
            </button>

            {calendarMessage && (
              <p style={{ marginTop: '0.65rem', fontSize: '0.8rem', color: '#122438' }}>
                {calendarMessage}
              </p>
            )}
          </div>
        </div>

        {/* CARD 3: GOOGLE TASKS */}
        <div
          style={{
            padding: '1.75rem',
            background: '#FAF7F0',
            borderRadius: '16px',
            border: '1.2px solid #E6DDCF',
            boxShadow: '0 4px 14px rgba(18, 36, 56, 0.04)',
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
                  padding: '0.2rem 0.55rem',
                  background: '#EDF4FA',
                  color: '#1E4B75',
                  borderRadius: '4px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-maru)',
                  marginBottom: '0.4rem',
                }}
              >
                GOOGLE TASKS
              </span>
              <h3 style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.2rem', color: '#122438', fontWeight: 700, margin: 0 }}>
                Nhiệm vụ hàng ngày
              </h3>
            </div>

            <p style={{ fontSize: '0.86rem', color: '#786A5E', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Đồng bộ mục tiêu học tập FSRS vào danh sách Google Tasks để hiển thị trên điện thoại và thanh bên Gmail.
            </p>

            <button
              onClick={handleSyncTasks}
              disabled={loading || !status.authenticated}
              className="btn-torii"
              style={{
                width: '100%',
                padding: '0.65rem',
                fontSize: '0.85rem',
                opacity: status.authenticated ? 1 : 0.6,
              }}
            >
              Đồng bộ vào Google Tasks
            </button>

            {taskMessage && (
              <p style={{ marginTop: '0.65rem', fontSize: '0.8rem', color: '#122438' }}>
                {taskMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
