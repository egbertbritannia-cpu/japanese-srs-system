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
 * Bộ dựng Markdown an toàn thuần React (BUG-RAG-05)
 * Tránh nguy cơ XSS khi hiển thị phản hồi từ AI mà vẫn làm đậm được **chữ**
 */
function renderSafeMarkdown(text: string) {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ color: 'var(--matcha-deep, #3E734E)' }}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export function JapaneseSenseiChat() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      {/* 1. NÚT NỔI FLOATING ACTION BUTTON (FAB) GÓC MÀN HÌNH */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Trợ giảng Nhật ngữ Sensei AI (RAG)"
        aria-label="Mở Trợ giảng Nhật ngữ Sensei AI"
        style={{
          position: 'fixed',
          bottom: '88px',
          right: '20px',
          zIndex: 90,
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1E4B75 0%, #0A1C33 100%)',
          border: '1.5px solid #D4AF37',
          boxShadow: '0 8px 24px rgba(18, 36, 56, 0.28), 0 2px 6px rgba(0, 0, 0, 0.12)',
          color: '#FFFFFF',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <SensuFanIcon size={26} color="#D4AF37" />
        <span
          style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: '#C83824',
            border: '2px solid #FFFFFF',
            boxShadow: '0 0 6px rgba(200, 56, 36, 0.6)',
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
            background: 'rgba(10, 28, 51, 0.45)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            zIndex: 95,
            transition: 'opacity 0.25s ease',
          }}
        />
      )}

      {/* 3. NGĂN TRƯỢT HỘI THOẠI BÊN HÔNG (SIDE DRAWER - GLASSMORPHISM) */}
      <div
        className="glass-drawer-surface"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: '440px',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.32s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* HEADER CỦA DRAWER */}
        <div
          style={{
            padding: '1.25rem 1.4rem',
            background: 'linear-gradient(135deg, #0A1C33 0%, #153255 100%)',
            color: '#FFFFFF',
            borderBottom: '1.5px solid rgba(200, 155, 88, 0.4)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.2rem', fontWeight: 800, color: '#FAF8F5' }}>
                Sensei AI · 日本語先生
              </span>
            </div>
            <div className="micro-badge-label" style={{ background: 'rgba(255, 255, 255, 0.12)', color: '#E8D9BD', marginTop: '0.35rem' }}>
              {contextConfig.badgeText}
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: '#FAF8F5',
              fontSize: '1.1rem',
              cursor: 'pointer',
              padding: '0.3rem 0.65rem',
              lineHeight: 1,
              transition: 'background 0.2s',
            }}
          >
            ✕
          </button>
        </div>

        {/* DANH SÁCH CÂU HỎI GỢI Ý NHANH (PROMPT CHIPS THEO NGỮ CẢNH) */}
        <div
          style={{
            padding: '0.75rem 1rem',
            background: 'rgba(240, 235, 224, 0.85)',
            borderBottom: '1px solid var(--washi-border)',
            display: 'flex',
            gap: '0.45rem',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
          }}
        >
          {contextConfig.suggestedChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip)}
              disabled={loading}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '999px',
                border: '1px solid var(--washi-border)',
                background: '#FFFFFF',
                color: '#122438',
                fontSize: '0.76rem',
                fontFamily: 'var(--font-maru)',
                fontWeight: 600,
                cursor: 'pointer',
                flexShrink: 0,
                boxShadow: 'var(--shadow-washi-sm)',
                transition: 'all 0.15s ease',
              }}
            >
              💬 {chip}
            </button>
          ))}
        </div>

        {/* KHU VỰC HIỂN THỊ NỘI DUNG TIN NHẮN */}
        <div
          style={{
            flex: 1,
            padding: '1.25rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {messages.map((m) => {
            const isSensei = m.sender === 'sensei';
            return (
              <div
                key={m.id}
                style={{
                  alignSelf: isSensei ? 'flex-start' : 'flex-end',
                  maxWidth: '90%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                }}
              >
                <div
                  style={{
                    padding: '0.95rem 1.2rem',
                    borderRadius: isSensei ? '16px 16px 16px 3px' : '16px 16px 3px 16px',
                    background: isSensei ? '#FFFFFF' : '#1E4B75',
                    color: isSensei ? '#122438' : '#FFFFFF',
                    border: isSensei ? '1px solid var(--washi-border)' : 'none',
                    boxShadow: isSensei ? 'var(--shadow-washi-md)' : '0 4px 12px rgba(30, 75, 117, 0.25)',
                    fontSize: '0.92rem',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {renderSafeMarkdown(m.text)}
                </div>

                {/* Hàng công cụ cho tin nhắn của Sensei: Nút Copy & Phát âm */}
                {isSensei && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0 0.5rem' }}>
                    <button
                      onClick={() => handleCopyText(m.id, m.text)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#786A5E',
                        fontSize: '0.72rem',
                        cursor: 'pointer',
                        padding: '0.15rem 0.35rem',
                      }}
                    >
                      {copiedId === m.id ? '✓ Đã chép' : '📋 Sao chép'}
                    </button>

                    <JapaneseSpeakerButton text={m.text} size={15} />

                    {m.references && m.references.length > 0 && (
                      <span style={{ fontSize: '0.7rem', color: '#786A5E' }}>
                        📖 {m.references.join(', ')}
                      </span>
                    )}

                    <span style={{ fontSize: '0.68rem', color: '#A09386', marginLeft: 'auto' }}>
                      {m.timestamp}
                    </span>
                  </div>
                )}

                {!isSensei && (
                  <span style={{ fontSize: '0.68rem', color: '#A09386', padding: '0 0.4rem', alignSelf: 'flex-end' }}>
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
                padding: '0.85rem 1.15rem',
                borderRadius: '14px',
                background: '#FFFFFF',
                border: '1.2px solid rgba(200, 155, 88, 0.4)',
                fontSize: '0.86rem',
                color: '#122438',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: 'var(--shadow-washi-sm)',
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
            padding: '1rem 1.25rem',
            background: 'rgba(250, 247, 242, 0.98)',
            borderTop: '1px solid var(--washi-border)',
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
              padding: '0.8rem 1.1rem',
              borderRadius: '12px',
              border: '1.2px solid var(--washi-border)',
              background: '#FFFFFF',
              color: '#122438',
              fontSize: '0.92rem',
              outline: 'none',
              fontFamily: 'var(--font-sans)',
              boxShadow: 'var(--shadow-washi-sm)',
            }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="btn-torii"
            style={{
              padding: '0.8rem 1.25rem',
              fontSize: '0.9rem',
              whiteSpace: 'nowrap',
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
