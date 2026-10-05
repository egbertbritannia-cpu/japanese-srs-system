'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { SensuFanIcon } from '@/components/japanese/Icons';
import { JapaneseSpeakerButton } from '@/components/japanese/JapaneseSpeakerButton';
import { getContextConfig, RouteContextConfig } from '@/lib/rag/context-prompts';

interface ChatMessage {
  id: string;
  sender: 'user' | 'sensei';
  text: string;
  references?: string[];
  timestamp: string;
}

/**
 * Bộ dựng Typography và Markdown an toàn thuần React (VIS-COPILOT-03, BUG-RAG-05)
 * Tự động phát hiện Kanji/Kana để gán Shippori Mincho, làm nổi bật cấu trúc ngữ pháp
 */
function renderSafeMarkdown(text: string) {
  if (!text) return null;

  // Split by bold tokens first: **text**
  const boldParts = text.split(/(\*\*[^*]+\*\*)/g);

  return boldParts.map((boldPart, i) => {
    if (boldPart.startsWith('**') && boldPart.endsWith('**')) {
      const content = boldPart.slice(2, -2);
      const hasKanji = /[\u4E00-\u9FAF]/.test(content);
      return (
        <strong
          key={i}
          style={{
            color: '#2A6B3D',
            fontFamily: hasKanji ? 'var(--font-mincho, "Shippori Mincho", serif)' : 'inherit',
            fontWeight: 800,
            background: 'rgba(42, 107, 61, 0.08)',
            padding: '0.1rem 0.35rem',
            borderRadius: '4px',
          }}
        >
          {content}
        </strong>
      );
    }

    // Split by Japanese text tokens (Kanji / Kana sequences)
    const jpParts = boldPart.split(/([\u4E00-\u9FAF\u3040-\u309F\u30A0-\u30FF]+)/g);
    return jpParts.map((part, j) => {
      if (/[\u4E00-\u9FAF]/.test(part)) {
        return (
          <span
            key={`${i}-${j}`}
            style={{
              fontFamily: 'var(--font-mincho, "Shippori Mincho", serif)',
              fontWeight: 700,
              color: '#1E4B75',
              fontSize: '1.05em',
            }}
          >
            {part}
          </span>
        );
      }
      return <span key={`${i}-${j}`}>{part}</span>;
    });
  });
}

export function JapaneseSenseiChat() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Detect mobile viewport for FAB positioning (VIS-COPILOT-01)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Lấy cấu hình ngữ cảnh động theo route hiện tại
  const contextConfig: RouteContextConfig = getContextConfig(pathname || '/');

  // Khởi tạo tin nhắn chào mừng theo ngữ cảnh màn hình khi lần đầu mở chat
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'msg_welcome',
          sender: 'sensei',
          text: `Konnichiwa! Tôi là **Sensei AI** đồng hành cùng bạn.\n\nHiện tại bạn đang ở **${contextConfig.badgeText}**. Bạn có câu hỏi nào về từ vựng, quy tắc chia thể Te, thể Ru hay cách ôn tập không? Hãy hỏi Sensei nhé!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [contextConfig, messages.length]);

  // Tự động cuộn xuống cuối danh sách tin nhắn
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          route: pathname || '/',
        }),
      });

      const data = await res.json();
      if (data.success) {
        const senseiMsg: ChatMessage = {
          id: `sensei_${Date.now()}`,
          sender: 'sensei',
          text: data.answer || 'Sensei đã ghi nhận câu hỏi nhưng chưa tìm thấy dữ liệu phù hợp trong giáo trình.',
          references: data.references,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, senseiMsg]);
      } else {
        throw new Error(data.error || 'Lỗi xử lý câu hỏi');
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'sensei',
          text: 'Sensei đang gặp gián đoạn kết nối. Bạn hãy thử gửi lại câu hỏi nhé!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 1. NÚT NỔI FLOATING ACTION BUTTON (FAB) GÓC MÀN HÌNH (VIS-COPILOT-01) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Trợ giảng Nhật ngữ Sensei AI (RAG)"
        aria-label="Mở Trợ giảng Nhật ngữ Sensei AI"
        style={{
          position: 'fixed',
          bottom: isMobile ? 'calc(5.75rem + env(safe-area-inset-bottom, 0px))' : '2rem',
          right: isMobile ? '1.25rem' : '2rem',
          zIndex: 90,
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1E4B75 0%, #0A1C33 100%)',
          border: '1.5px solid #D4AF37',
          boxShadow: '0 8px 28px rgba(18, 36, 56, 0.32), 0 2px 8px rgba(0, 0, 0, 0.15)',
          color: '#FFFFFF',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <SensuFanIcon size={28} color="#AF7E36" />
        <span
          style={{
            position: 'absolute',
            top: '3px',
            right: '3px',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: '#9E3223',
            border: '2px solid #FAF8F2',
            boxShadow: '0 0 8px rgba(158, 50, 35, 0.8)',
          }}
        />
      </button>

      {/* 2. LỚP PHỦ MỜ KHI MỞ DRAWER (BACKDROP) */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(22, 37, 59, 0.45)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            zIndex: 95,
            transition: 'opacity 0.25s ease',
          }}
        />
      )}

      {/* 3. NGĂN TRƯỢT HỘI THOẠI BÊN HÔNG (SIDE DRAWER - GLASSMORPHISM - VIS-COPILOT-02) */}
      <div
        className="glass-drawer-surface"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: isMobile ? '100%' : '460px',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(250, 248, 242, 0.94)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderLeft: '1.5px solid rgba(175, 126, 54, 0.4)',
          boxShadow: '-8px 0 36px rgba(22, 37, 59, 0.18)',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.32s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* HEADER CỦA DRAWER */}
        <div
          style={{
            padding: '1.25rem 1.4rem',
            background: 'linear-gradient(135deg, #101B2B 0%, #16253B 100%)',
            color: '#FFFFFF',
            borderBottom: '1.5px solid rgba(175, 126, 54, 0.4)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.25rem', fontWeight: 800, color: '#FAF8F2' }}>
                Sensei AI · 日本語先生
              </span>
            </div>
            <div className="micro-badge-label" style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#FBF5E8', marginTop: '0.35rem', borderRadius: '4px', padding: '0.15rem 0.5rem' }}>
              {contextConfig.badgeText}
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '8px',
              color: '#FAF8F2',
              fontSize: '1.1rem',
              cursor: 'pointer',
              padding: '0.35rem 0.75rem',
              lineHeight: 1,
              transition: 'background 0.2s',
            }}
          >
            ✕
          </button>
        </div>

        {/* DANH SÁCH CÂU HỎI GỢI Ý NHANH (PROMPT CHIPS - VIS-COPILOT-05) */}
        <div
          style={{
            padding: '0.75rem 1rem',
            background: 'rgba(247, 244, 235, 0.9)',
            borderBottom: '1px solid var(--washi-border, #DFD9CB)',
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            scrollbarWidth: 'none',
          }}
        >
          {contextConfig.suggestedChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip)}
              disabled={loading}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '999px',
                border: '1.2px solid #DFD9CB',
                background: '#FAF8F2',
                color: '#1A1918',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-maru, sans-serif)',
                fontWeight: 700,
                cursor: 'pointer',
                flexShrink: 0,
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              💬 {chip}
            </button>
          ))}
        </div>

        {/* KHU VỰC HIỂN THỊ NỘI DUNG TIN NHẮN (VIS-COPILOT-03) */}
        <div
          style={{
            flex: 1,
            padding: '1.25rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            background: 'rgba(247, 244, 235, 0.5)',
          }}
        >
          {messages.map((m) => {
            const isSensei = m.sender === 'sensei';
            return (
              <div
                key={m.id}
                style={{
                  alignSelf: isSensei ? 'flex-start' : 'flex-end',
                  maxWidth: '92%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.3rem',
                }}
              >
                <div
                  style={{
                    padding: '1rem 1.25rem',
                    borderRadius: isSensei ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
                    background: isSensei ? '#FAF8F2' : '#16253B',
                    color: isSensei ? '#1A1918' : '#F0F4F8',
                    border: isSensei ? '1.2px solid var(--washi-border, #DFD9CB)' : 'none',
                    boxShadow: isSensei ? '0 4px 14px rgba(26, 25, 24, 0.05)' : '0 4px 14px rgba(22, 37, 59, 0.25)',
                    fontSize: '0.94rem',
                    lineHeight: 1.65,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {renderSafeMarkdown(m.text)}
                </div>

                {/* Hàng công cụ cho tin nhắn của Sensei */}
                {isSensei && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0 0.5rem' }}>
                    <button
                      onClick={() => handleCopyText(m.id, m.text)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#878278',
                        fontSize: '0.74rem',
                        cursor: 'pointer',
                        padding: '0.15rem 0.35rem',
                        fontWeight: 600,
                      }}
                    >
                      {copiedId === m.id ? '✓ Đã chép' : '📋 Sao chép'}
                    </button>

                    <JapaneseSpeakerButton text={m.text} size={15} />

                    {m.references && m.references.length > 0 && (
                      <span style={{ fontSize: '0.72rem', color: '#878278' }}>
                        📖 {m.references.join(', ')}
                      </span>
                    )}

                    <span style={{ fontSize: '0.7rem', color: '#BCB7AC', marginLeft: 'auto', fontFamily: 'var(--font-mono, monospace)' }}>
                      {m.timestamp}
                    </span>
                  </div>
                )}

                {!isSensei && (
                  <span style={{ fontSize: '0.7rem', color: '#BCB7AC', padding: '0 0.4rem', alignSelf: 'flex-end', fontFamily: 'var(--font-mono, monospace)' }}>
                    {m.timestamp}
                  </span>
                )}
              </div>
            );
          })}

          {loading && (
            <div
              className="sensei-thinking-glow"
              style={{
                alignSelf: 'flex-start',
                padding: '0.9rem 1.25rem',
                borderRadius: '16px',
                background: '#FAF8F2',
                border: '1.2px solid rgba(175, 126, 54, 0.4)',
                fontSize: '0.88rem',
                color: '#1A1918',
                display: 'flex',
                alignItems: 'center',
                gap: '0.55rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
              }}
            >
              <span>✍️</span> Sensei đang tra cứu kiến thức và phân tích ngữ cảnh...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* KHU VỰC NHẬP LIỆU CÂU HỎI */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          style={{
            padding: isMobile ? '0.85rem 1rem calc(0.85rem + env(safe-area-inset-bottom, 0px))' : '1rem 1.25rem',
            background: 'rgba(247, 244, 235, 0.98)',
            borderTop: '1px solid var(--washi-border, #DFD9CB)',
            display: 'flex',
            gap: '0.65rem',
            alignItems: 'center',
          }}
        >
          <input
            type="text"
            placeholder="Hỏi Sensei về bài học, thể Te, Hán tự..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            style={{
              flex: 1,
              padding: '0.85rem 1.15rem',
              borderRadius: '12px',
              border: '1.2px solid var(--washi-border, #DFD9CB)',
              background: '#FAF8F2',
              color: '#1A1918',
              fontSize: '0.92rem',
              outline: 'none',
              fontFamily: 'var(--font-sans)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="btn-torii"
            style={{
              padding: '0.85rem 1.35rem',
              fontSize: '0.92rem',
              whiteSpace: 'nowrap',
              borderRadius: '12px',
              opacity: loading || !input.trim() ? 0.6 : 1,
            }}
          >
            Gửi
          </button>
        </form>
      </div>
    </>
  );
}
