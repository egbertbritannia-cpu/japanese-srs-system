'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { SensuFanIcon } from '@/components/japanese/Icons';
import { getContextConfig, RouteContextConfig } from '@/lib/rag/context-prompts';

interface ChatMessage {
  id: string;
  sender: 'user' | 'sensei';
  text: string;
  references?: string[];
  timestamp: string;
}

export function JapaneseSenseiChat() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
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
          text: data.answer || 'Xin lỗi, Sensei chưa tìm thấy thông tin phù hợp.',
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
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1E4B75 0%, #0D233A 100%)',
          border: '2px solid #C89B58',
          boxShadow: '0 6px 20px rgba(18, 36, 56, 0.28)',
          color: '#FFFFFF',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        }}
      >
        <SensuFanIcon size={24} color="#C89B58" />
        <span
          style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: '#C83824',
            border: '2px solid #FFFFFF',
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
            background: 'rgba(18, 36, 56, 0.45)',
            backdropFilter: 'blur(3px)',
            WebkitBackdropFilter: 'blur(3px)',
            zIndex: 95,
            transition: 'opacity 0.2s',
          }}
        />
      )}

      {/* 3. NGĂN TRƯỢT HỘI THOẠI BÊN HÔNG (SIDE DRAWER) */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: '430px',
          background: '#FAF7F0',
          borderLeft: '2px solid #E6DDCF',
          boxShadow: '-8px 0 32px rgba(18, 36, 56, 0.18)',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* HEADER CỦA DRAWER */}
        <div
          style={{
            padding: '1.25rem 1.4rem',
            background: '#122438',
            color: '#FFFFFF',
            borderBottom: '2px solid #C89B58',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span style={{ fontFamily: 'var(--font-mincho)', fontSize: '1.15rem', fontWeight: 800 }}>
                Sensei AI · 日本語先生
              </span>
            </div>
            <div style={{ fontSize: '0.76rem', color: '#E8D9BD', marginTop: '0.2rem', fontFamily: 'var(--font-maru)' }}>
              {contextConfig.badgeText}
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              color: '#E8D9BD',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0.2rem 0.5rem',
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        {/* DANH SÁCH CÂU HỎI GỢI Ý NHANH (PROMPT CHIPS THEO NGỮ CẢNH) */}
        <div
          style={{
            padding: '0.65rem 1rem',
            background: '#F0EBE0',
            borderBottom: '1px solid #E4DAC9',
            display: 'flex',
            gap: '0.4rem',
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
                padding: '0.3rem 0.65rem',
                borderRadius: '999px',
                border: '1px solid #D6C8B5',
                background: '#FFFFFF',
                color: '#122438',
                fontSize: '0.74rem',
                fontFamily: 'var(--font-maru)',
                fontWeight: 600,
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.15s',
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
                  maxWidth: '88%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.2rem',
                }}
              >
                <div
                  style={{
                    padding: '0.85rem 1.1rem',
                    borderRadius: isSensei ? '14px 14px 14px 2px' : '14px 14px 2px 14px',
                    background: isSensei ? '#FFFFFF' : '#1E4B75',
                    color: isSensei ? '#122438' : '#FFFFFF',
                    border: isSensei ? '1.2px solid #E6DDCF' : 'none',
                    boxShadow: '0 2px 6px rgba(18, 36, 56, 0.05)',
                    fontSize: '0.9rem',
                    lineHeight: 1.55,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {m.text}
                </div>

                {/* Tài liệu tham chiếu RAG nếu có */}
                {m.references && m.references.length > 0 && (
                  <div style={{ fontSize: '0.7rem', color: '#786A5E', padding: '0 0.4rem' }}>
                    📖 Trích dẫn: {m.references.join(', ')}
                  </div>
                )}

                <span style={{ fontSize: '0.68rem', color: '#A09386', padding: '0 0.4rem', alignSelf: isSensei ? 'flex-start' : 'flex-end' }}>
                  {m.timestamp}
                </span>
              </div>
            );
          })}

          {loading && (
            <div
              style={{
                alignSelf: 'flex-start',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                background: '#FFFFFF',
                border: '1.2px solid #E6DDCF',
                fontSize: '0.85rem',
                color: '#786A5E',
                fontStyle: 'italic',
              }}
            >
              ✍️ Sensei đang suy nghĩ và tra cứu bài học...
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
            padding: '0.9rem 1.15rem',
            background: '#FAF7F0',
            borderTop: '1.2px solid #E6DDCF',
            display: 'flex',
            gap: '0.5rem',
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
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              border: '1.2px solid #D6C8B5',
              background: '#FFFFFF',
              color: '#122438',
              fontSize: '0.9rem',
              outline: 'none',
              fontFamily: 'var(--font-sans)',
            }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="btn-torii"
            style={{
              padding: '0.75rem 1.15rem',
              fontSize: '0.88rem',
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
