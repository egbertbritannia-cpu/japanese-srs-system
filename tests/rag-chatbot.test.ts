import { describe, it, expect } from 'vitest';
import { searchKnowledge } from '../src/lib/rag/knowledge-base';
import { getContextConfig, ROUTE_CONTEXT_MATRIX } from '../src/lib/rag/context-prompts';
import { POST } from '../src/app/api/chat/route';

describe('Japanese Sensei AI RAG & Context-Aware Prompting Suite', () => {
  describe('Local RAG Knowledge Base Retrieval', () => {
    it('should retrieve te-form grammar rules when queried about thể te', () => {
      const snippets = searchKnowledge('thể te biến âm', 3);
      expect(snippets.length).toBeGreaterThan(0);
      const content = snippets.map((s) => s.content).join(' ');
      expect(content).toContain('促音便');
    });

    it('should retrieve specific exception knowledge for 行く (iku)', () => {
      const snippets = searchKnowledge('ngoại lệ 行く', 3);
      expect(snippets.length).toBeGreaterThan(0);
      const content = snippets.map((s) => s.content).join(' ');
      expect(content).toContain('行って');
    });

    it('should retrieve FSRS algorithm knowledge when asked about fsrs', () => {
      const snippets = searchKnowledge('thuật toán fsrs lặp lại ngắt quãng', 3);
      expect(snippets.length).toBeGreaterThan(0);
      const content = snippets.map((s) => s.content).join(' ');
      expect(content).toContain('Stability');
    });

    it('should search through 50 verbs dataset and return verb details', () => {
      const snippets = searchKnowledge('食べる', 3);
      expect(snippets.length).toBeGreaterThan(0);
      const top = snippets[0];
      expect(top.title).toContain('食べる');
      expect(top.content).toContain('食べて');
    });
  });

  describe('Route Context-Aware Matrix', () => {
    it('should return dashboard config for root route /', () => {
      const config = getContextConfig('/');
      expect(config.contextId).toBe('dashboard');
      expect(config.badgeText).toContain('Cố vấn Lộ trình');
    });

    it('should return conjugation config for /conjugation route', () => {
      const config = getContextConfig('/conjugation');
      expect(config.contextId).toBe('conjugation');
      expect(config.badgeText).toContain('Gia sư Thể Te & Ru');
      expect(config.suggestedChips.length).toBeGreaterThanOrEqual(3);
    });

    it('should return review config for /review route', () => {
      const config = getContextConfig('/review');
      expect(config.contextId).toBe('review');
      expect(config.badgeText).toContain('Trợ giảng Karuta');
    });

    it('should return library config for /cards route', () => {
      const config = getContextConfig('/cards');
      expect(config.contextId).toBe('library');
      expect(config.badgeText).toContain('Thư viện Hán tự');
    });

    it('should return creator config for /cards/new route', () => {
      const config = getContextConfig('/cards/new');
      expect(config.contextId).toBe('creator');
      expect(config.badgeText).toContain('Biên tập viên');
    });
  });

  describe('/api/chat Route Handler', () => {
    it('should reject empty message with 400', async () => {
      const req = new Request('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: '', route: '/' }),
      });

      const res = await POST(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBeDefined();
    });

    it('should handle question about te-form on /conjugation route and return structured response', async () => {
      const req = new Request('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Quy tắc chia thể Te của nhóm 1 là gì?',
          route: '/conjugation',
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.contextId).toBe('conjugation');
      expect(data.answer).toContain('Nhóm 1');
      expect(data.answer).toContain('促音便');
      expect(data.references).toBeDefined();
    });

    it('should handle question about FSRS on / route', async () => {
      const req = new Request('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'FSRS tính chu kỳ thế nào?',
          route: '/',
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.contextId).toBe('dashboard');
      expect(data.answer).toContain('FSRS');
    });
  });
});
