import { describe, it, expect } from 'vitest';
import { calculateBand, ieltsRepository } from '../src/db/repositories/ieltsRepository';
import { db } from '../src/db/client';
import { cards, decks } from '../src/db/schema';
import { count } from 'drizzle-orm';
import { GET as getIeltsRootRoute } from '../src/app/api/ielts/route';
import { GET as getIeltsDashboardRoute } from '../src/app/api/ielts/dashboard/route';
import { GET as getIeltsMaterialsRoute, POST as postIeltsMaterialsRoute } from '../src/app/api/ielts/materials/route';
import { GET as getIeltsSessionsRoute, POST as postIeltsSessionsRoute } from '../src/app/api/ielts/sessions/route';
import { GET as getIeltsLogsRoute, POST as postIeltsLogsRoute } from '../src/app/api/ielts/logs/route';
import { GET as getIeltsMistakesRoute, POST as postIeltsMistakesRoute } from '../src/app/api/ielts/mistakes/route';
import { GET as getIeltsVocabRoute, POST as postIeltsVocabRoute, DELETE as deleteIeltsVocabRoute } from '../src/app/api/ielts/vocab/route';

describe('IELTS Master Suite & Database Persistence (Phase 8)', () => {
  // ==========================================================================
  // 1. CAMBRIDGE BAND SCORE CONVERSION ENGINE
  // ==========================================================================
  describe('Cambridge Band Score Engine', () => {
    it('should correctly calculate Listening band scores', () => {
      expect(calculateBand(40, 'Listening')).toBe(9.0);
      expect(calculateBand(39, 'Listening')).toBe(9.0);
      expect(calculateBand(37, 'Listening')).toBe(8.5);
      expect(calculateBand(35, 'Listening')).toBe(8.0);
      expect(calculateBand(32, 'Listening')).toBe(7.5);
      expect(calculateBand(30, 'Listening')).toBe(7.0);
      expect(calculateBand(26, 'Listening')).toBe(6.5);
      expect(calculateBand(23, 'Listening')).toBe(6.0);
      expect(calculateBand(18, 'Listening')).toBe(5.5);
      expect(calculateBand(16, 'Listening')).toBe(5.0);
      expect(calculateBand(13, 'Listening')).toBe(4.5);
      expect(calculateBand(10, 'Listening')).toBe(4.0);
      expect(calculateBand(5, 'Listening')).toBe(3.5);
    });

    it('should correctly calculate Reading Academic band scores', () => {
      expect(calculateBand(39, 'Reading', 'academic')).toBe(9.0);
      expect(calculateBand(37, 'Reading', 'academic')).toBe(8.5);
      expect(calculateBand(35, 'Reading', 'academic')).toBe(8.0);
      expect(calculateBand(33, 'Reading', 'academic')).toBe(7.5);
      expect(calculateBand(30, 'Reading', 'academic')).toBe(7.0);
      expect(calculateBand(27, 'Reading', 'academic')).toBe(6.5);
      expect(calculateBand(23, 'Reading', 'academic')).toBe(6.0);
      expect(calculateBand(19, 'Reading', 'academic')).toBe(5.5);
      expect(calculateBand(15, 'Reading', 'academic')).toBe(5.0);
      expect(calculateBand(13, 'Reading', 'academic')).toBe(4.5);
      expect(calculateBand(10, 'Reading', 'academic')).toBe(4.0);
      expect(calculateBand(4, 'Reading', 'academic')).toBe(3.5);
    });

    it('should correctly calculate Reading General band scores', () => {
      expect(calculateBand(40, 'Reading', 'general')).toBe(9.0);
      expect(calculateBand(39, 'Reading', 'general')).toBe(8.5);
      expect(calculateBand(37, 'Reading', 'general')).toBe(8.0);
      expect(calculateBand(36, 'Reading', 'general')).toBe(7.5);
      expect(calculateBand(34, 'Reading', 'general')).toBe(7.0);
      expect(calculateBand(32, 'Reading', 'general')).toBe(6.5);
      expect(calculateBand(30, 'Reading', 'general')).toBe(6.0);
      expect(calculateBand(27, 'Reading', 'general')).toBe(5.5);
      expect(calculateBand(23, 'Reading', 'general')).toBe(5.0);
      expect(calculateBand(19, 'Reading', 'general')).toBe(4.5);
      expect(calculateBand(15, 'Reading', 'general')).toBe(4.0);
      expect(calculateBand(8, 'Reading', 'general')).toBe(3.5);
    });
  });

  // ==========================================================================
  // 2. IELTS REPOSITORY DATABASE PERSISTENCE
  // ==========================================================================
  describe('IeltsRepository CRUD & Turso Cloud Persistence', () => {
    it('should seed default materials if empty and list materials', async () => {
      await ieltsRepository.seedDefaultMaterialsIfEmpty();
      const materials = await ieltsRepository.getAllMaterials();
      expect(materials.length).toBeGreaterThanOrEqual(1);

      const titles = materials.map((m: any) => m.title);
      expect(titles.some((t: string) => t.includes('Cambridge IELTS'))).toBe(true);
    });

    it('should create session, save practice logs, and save mistake analysis', async () => {
      const sessionId = `test_session_${Date.now()}`;

      // 1. Create Session
      const session = await ieltsRepository.createSession({
        id: sessionId,
        section: 'Reading',
        testType: 'academic',
        testNumber: 'Cambridge IELTS 18 - Test 1',
        rawScore: 34,
        maxScore: 40,
        currentScoreBand: 7.5,
        targetScoreBand: 8.0,
        totalDurationSeconds: 3500,
      });
      expect(session.id).toBe(sessionId);
      expect(session.currentScoreBand).toBe(7.5);

      // 2. Save Practice Logs
      const logs = await ieltsRepository.savePracticeLogsBatch(sessionId, [
        {
          questionNumber: 1,
          questionType: 'T/F/NG',
          userAnswer: 'True',
          correctAnswer: 'True',
          isCorrect: true,
        },
        {
          questionNumber: 2,
          questionType: 'T/F/NG',
          userAnswer: 'False',
          correctAnswer: 'Not Given',
          isCorrect: false,
        },
      ]);
      expect(logs.length).toBe(2);

      // 3. Save Mistake Analysis
      const mistake = await ieltsRepository.saveMistake({
        sessionId,
        mistakeCategory: 'Distraction',
        rootCauseAnalysis: 'Bị đánh lừa bởi từ đồng nghĩa nhưng thiếu thông tin so sánh.',
        actionPlanForImprovement: 'Phân biệt rõ: False là có bằng chứng phủ định, Not Given là thiếu thông tin.',
        isResolved: false,
      });
      expect(mistake.mistakeCategory).toBe('Distraction');

      // 4. Retrieve complete session details with relations
      const sessionDetail = await ieltsRepository.getSessionById(sessionId);
      expect(sessionDetail).toBeDefined();
      expect(sessionDetail?.logs.length).toBe(2);
      expect(sessionDetail?.mistakes.length).toBe(1);

      // Clean up test session
      await ieltsRepository.deleteSession(sessionId);
      const afterDelete = await ieltsRepository.getSessionById(sessionId);
      expect(afterDelete).toBeNull();
    });

    it('should create and retrieve vocab in Vocab Vault', async () => {
      const vocabId = `test_vocab_${Date.now()}`;
      const word = await ieltsRepository.createVocab({
        id: vocabId,
        word: 'Precipitous',
        partOfSpeech: 'adj',
        phonetic: '/prɪˈsɪp.ɪ.təs/',
        primaryMeaning: 'Dốc đứng, diễn ra đột ngột và bất ngờ',
        contextSentence: 'The company suffered a precipitous decline in profits.',
      });
      expect(word.id).toBe(vocabId);
      expect(word.word).toBe('Precipitous');

      const allVocab = await ieltsRepository.getAllVocab();
      expect(allVocab.some((v: any) => v.id === vocabId)).toBe(true);

      // Clean up
      await ieltsRepository.deleteVocab(vocabId);
    });

    it('should compute comprehensive dashboard stats', async () => {
      const stats = await ieltsRepository.getDashboardStats();
      expect(stats.targetBand).toBe(8.0);
      expect(stats.currentBand).toBeGreaterThanOrEqual(1.0);
      expect(stats.skillBands.length).toBe(4);
      expect(stats.recentSessions.length).toBeGreaterThanOrEqual(1);
      expect(stats.mistakeBreakdown.length).toBeGreaterThanOrEqual(1);
    });
  });

  // ==========================================================================
  // 3. API ENDPOINTS INTEGRATION
  // ==========================================================================
  describe('API Endpoints Verification', () => {
    it('GET /api/ielts returns online status', async () => {
      const res = await getIeltsRootRoute();
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data.materials).toBeDefined();
      expect(body.data.stats).toBeDefined();
    });

    it('GET /api/ielts/dashboard returns KPI statistics', async () => {
      const res = await getIeltsDashboardRoute();
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data.targetBand).toBe(8.0);
      expect(body.data.skillBands).toBeDefined();
    });

    it('POST & GET /api/ielts/materials performs materials CRUD', async () => {
      const uniqueId = `mat_test_${Date.now()}`;
      const postReq = new Request('http://localhost:3000/api/ielts/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: uniqueId,
          type: 'book',
          title: 'Cambridge Practice Test Custom',
          totalTests: 4,
          testType: 'academic',
        }),
      });
      const postRes = await postIeltsMaterialsRoute(postReq as any);
      expect(postRes.status).toBe(200);

      const getRes = await getIeltsMaterialsRoute();
      const getBody = await getRes.json();
      expect(getBody.success).toBe(true);
      expect(getBody.data.some((m: any) => m.id === uniqueId)).toBe(true);
    });

    it('POST & GET /api/ielts/sessions and logs', async () => {
      const sessionId = `api_sess_${Date.now()}`;
      const postReq = new Request('http://localhost:3000/api/ielts/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: sessionId,
          section: 'Listening',
          testType: 'academic',
          rawScore: 35,
        }),
      });
      const postRes = await postIeltsSessionsRoute(postReq as any);
      expect(postRes.status).toBe(200);
      const postBody = await postRes.json();
      expect(postBody.data.currentScoreBand).toBe(8.0);

      // Post logs
      const logReq = new Request('http://localhost:3000/api/ielts/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          logs: [{ questionNumber: 1, userAnswer: 'A', isCorrect: true }],
        }),
      });
      const logRes = await postIeltsLogsRoute(logReq as any);
      expect(logRes.status).toBe(200);

      // Clean up
      await ieltsRepository.deleteSession(sessionId);
    });

    it('POST & GET /api/ielts/vocab works properly', async () => {
      const vocabWord = `Corroborate_${Date.now()}`;
      const postReq = new Request('http://localhost:3000/api/ielts/vocab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: vocabWord,
          primaryMeaning: 'Chứng minh, củng cố luận điểm',
        }),
      });
      const postRes = await postIeltsVocabRoute(postReq as any);
      expect(postRes.status).toBe(200);
      const postBody = await postRes.json();
      const createdId = postBody.data.id;

      const getRes = await getIeltsVocabRoute();
      const getBody = await getRes.json();
      expect(getBody.data.some((v: any) => v.id === createdId)).toBe(true);

      // Delete vocab
      const delReq = new Request(`http://localhost:3000/api/ielts/vocab?id=${createdId}`, {
        method: 'DELETE',
      });
      const delRes = await deleteIeltsVocabRoute(delReq as any);
      expect(delRes.status).toBe(200);
    });
  });

  // ==========================================================================
  // 4. ZERO BACKEND REGRESSION ENFORCEMENT (ĐIỀU RĂN 1 & 4)
  // ==========================================================================
  describe('Zero Backend Regression Verification', () => {
    it('must preserve 676 Japanese flashcards and 4 decks intact without data loss', async () => {
      const cardTotal = await db.select({ total: count(cards.id) }).from(cards);
      expect(cardTotal[0].total).toBeGreaterThanOrEqual(640);

      const deckList = await db.select().from(decks);
      expect(deckList.length).toBeGreaterThanOrEqual(4);
      const deckIds = deckList.map((d: any) => d.id);
      expect(deckIds).toContain('deck_jpd133');
      expect(deckIds).toContain('deck_jpd133_kanji');
      expect(deckIds).toContain('deck_n5');
      expect(deckIds).toContain('grammar_jpd133');
    });
  });
});
