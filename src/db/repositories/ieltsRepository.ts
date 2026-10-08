import { db } from '../client';
import {
  engMaterials,
  ieltsSessions,
  ieltsPracticeLogs,
  ieltsMistakes,
  engVocab,
} from '../schema';
import { eq, desc, asc, sql } from 'drizzle-orm';

/**
 * Thuật toán quy đổi Band Score IELTS chuẩn Cambridge (Academic & General)
 */
export function calculateBand(
  rawScore: number,
  section: 'Reading' | 'Listening' | string,
  testType: 'academic' | 'general' | string = 'academic'
): number {
  const score = Math.max(0, Math.min(40, Math.round(rawScore)));

  if (section === 'Listening') {
    if (score >= 39) return 9.0;
    if (score >= 37) return 8.5;
    if (score >= 35) return 8.0;
    if (score >= 32) return 7.5;
    if (score >= 30) return 7.0;
    if (score >= 26) return 6.5;
    if (score >= 23) return 6.0;
    if (score >= 18) return 5.5;
    if (score >= 16) return 5.0;
    if (score >= 13) return 4.5;
    if (score >= 10) return 4.0;
    return 3.5;
  }

  // Reading Academic
  if (testType === 'academic') {
    if (score >= 39) return 9.0;
    if (score >= 37) return 8.5;
    if (score >= 35) return 8.0;
    if (score >= 33) return 7.5;
    if (score >= 30) return 7.0;
    if (score >= 27) return 6.5;
    if (score >= 23) return 6.0;
    if (score >= 19) return 5.5;
    if (score >= 15) return 5.0;
    if (score >= 13) return 4.5;
    if (score >= 10) return 4.0;
    return 3.5;
  }

  // Reading General Training
  if (score >= 40) return 9.0;
  if (score >= 39) return 8.5;
  if (score >= 37) return 8.0;
  if (score >= 36) return 7.5;
  if (score >= 34) return 7.0;
  if (score >= 32) return 6.5;
  if (score >= 30) return 6.0;
  if (score >= 27) return 5.5;
  if (score >= 23) return 5.0;
  if (score >= 19) return 4.5;
  if (score >= 15) return 4.0;
  return 3.5;
}

export class IeltsRepository {
  /**
   * Đảm bảo tài liệu mặc định (Cambridge IELTS 16-19) đã được seed
   */
  static async seedDefaultMaterialsIfEmpty(): Promise<void> {
    try {
      const existing = await db.select().from(engMaterials).limit(1);
      if (existing && existing.length > 0) return;

      const defaults = [
        {
          id: 'mat_cam_19_acad',
          type: 'book',
          title: 'Cambridge IELTS 19 Academic',
          publisher: 'Cambridge University Press',
          yearPublished: 2024,
          totalTests: 4,
          testType: 'academic',
          createdAt: new Date(),
        },
        {
          id: 'mat_cam_18_acad',
          type: 'book',
          title: 'Cambridge IELTS 18 Academic',
          publisher: 'Cambridge University Press',
          yearPublished: 2023,
          totalTests: 4,
          testType: 'academic',
          createdAt: new Date(),
        },
        {
          id: 'mat_cam_17_acad',
          type: 'book',
          title: 'Cambridge IELTS 17 Academic',
          publisher: 'Cambridge University Press',
          yearPublished: 2022,
          totalTests: 4,
          testType: 'academic',
          createdAt: new Date(),
        },
        {
          id: 'mat_cam_16_acad',
          type: 'book',
          title: 'Cambridge IELTS 16 Academic',
          publisher: 'Cambridge University Press',
          yearPublished: 2021,
          totalTests: 4,
          testType: 'academic',
          createdAt: new Date(),
        },
        {
          id: 'mat_cam_18_gen',
          type: 'book',
          title: 'Cambridge IELTS 18 General Training',
          publisher: 'Cambridge University Press',
          yearPublished: 2023,
          totalTests: 4,
          testType: 'general',
          createdAt: new Date(),
        },
      ];

      for (const m of defaults) {
        await db.insert(engMaterials).values(m).onConflictDoNothing();
      }
    } catch (err) {
      console.warn('[IeltsRepository] seedDefaultMaterialsIfEmpty warning:', err);
    }
  }

  // ==========================================================================
  // MATERIALS
  // ==========================================================================

  static async getAllMaterials() {
    await this.seedDefaultMaterialsIfEmpty();
    return db.select().from(engMaterials).orderBy(desc(engMaterials.createdAt));
  }

  static async createMaterial(data: {
    id?: string;
    type: string;
    title: string;
    publisher?: string;
    yearPublished?: number;
    totalTests?: number;
    testType?: string;
  }) {
    const id = data.id || `mat_${Date.now()}`;
    const newRecord = {
      id,
      type: data.type,
      title: data.title,
      publisher: data.publisher,
      yearPublished: data.yearPublished,
      totalTests: data.totalTests || 4,
      testType: data.testType || 'academic',
      createdAt: new Date(),
    };
    await db.insert(engMaterials).values(newRecord);
    return newRecord;
  }

  // ==========================================================================
  // SESSIONS
  // ==========================================================================

  static async getAllSessions(limitCount = 20) {
    return db
      .select()
      .from(ieltsSessions)
      .orderBy(desc(ieltsSessions.startTime))
      .limit(limitCount);
  }

  static async getSessionById(sessionId: string) {
    const sessionRows = await db
      .select()
      .from(ieltsSessions)
      .where(eq(ieltsSessions.id, sessionId));

    if (!sessionRows || sessionRows.length === 0) return null;
    const session = sessionRows[0];

    const logs = await db
      .select()
      .from(ieltsPracticeLogs)
      .where(eq(ieltsPracticeLogs.sessionId, sessionId))
      .orderBy(asc(ieltsPracticeLogs.questionNumber));

    const mistakes = await db
      .select()
      .from(ieltsMistakes)
      .where(eq(ieltsMistakes.sessionId, sessionId));

    return {
      ...session,
      logs,
      mistakes,
    };
  }

  static async createSession(data: {
    id?: string;
    materialId?: string;
    testNumber?: string;
    testType?: string;
    section: string;
    startTime?: number;
    endTime?: number;
    totalDurationSeconds?: number;
    rawScore?: number;
    maxScore?: number;
    currentScoreBand?: number;
    targetScoreBand?: number;
    sessionStatus?: string;
  }) {
    const id = data.id || `ielts_${Date.now()}`;
    const testType = data.testType || 'academic';
    const rawScore = data.rawScore !== undefined ? data.rawScore : null;
    let band = data.currentScoreBand;

    if (band === undefined && rawScore !== null && (data.section === 'Reading' || data.section === 'Listening')) {
      band = calculateBand(rawScore, data.section, testType);
    }

    const newRecord = {
      id,
      materialId: data.materialId || null,
      testNumber: data.testNumber || 'Test 1',
      testType,
      section: data.section,
      startTime: data.startTime || Date.now(),
      endTime: data.endTime || null,
      totalDurationSeconds: data.totalDurationSeconds || null,
      rawScore,
      maxScore: data.maxScore || 40,
      currentScoreBand: band !== undefined ? band : null,
      targetScoreBand: data.targetScoreBand !== undefined ? data.targetScoreBand : 8.0,
      sessionStatus: data.sessionStatus || 'completed',
      createdAt: new Date(),
    };

    await db.insert(ieltsSessions).values(newRecord);
    return newRecord;
  }

  static async updateSession(
    sessionId: string,
    data: Partial<{
      endTime: number;
      totalDurationSeconds: number;
      rawScore: number;
      maxScore: number;
      currentScoreBand: number;
      targetScoreBand: number;
      sessionStatus: string;
    }>
  ) {
    await db
      .update(ieltsSessions)
      .set(data)
      .where(eq(ieltsSessions.id, sessionId));

    return this.getSessionById(sessionId);
  }

  static async deleteSession(sessionId: string) {
    await db.delete(ieltsMistakes).where(eq(ieltsMistakes.sessionId, sessionId));
    await db.delete(ieltsPracticeLogs).where(eq(ieltsPracticeLogs.sessionId, sessionId));
    await db.delete(ieltsSessions).where(eq(ieltsSessions.id, sessionId));
    return { success: true };
  }

  // ==========================================================================
  // PRACTICE LOGS
  // ==========================================================================

  static async getPracticeLogs(sessionId: string) {
    return db
      .select()
      .from(ieltsPracticeLogs)
      .where(eq(ieltsPracticeLogs.sessionId, sessionId))
      .orderBy(asc(ieltsPracticeLogs.questionNumber));
  }

  static async savePracticeLogsBatch(
    sessionId: string,
    logs: Array<{
      id?: string;
      questionNumber: number;
      questionType?: string;
      userAnswer?: string;
      correctAnswer?: string;
      isCorrect?: boolean;
      timeSpentSeconds?: number;
      submissionText?: string;
      audioUrl?: string;
      criteriaScores?: string;
      notes?: string;
    }>
  ) {
    if (!logs || logs.length === 0) return [];

    const records = logs.map((log) => ({
      id: log.id || `log_${sessionId}_q${log.questionNumber}_${Date.now()}`,
      sessionId,
      questionNumber: log.questionNumber,
      questionType: log.questionType || null,
      userAnswer: log.userAnswer || null,
      correctAnswer: log.correctAnswer || null,
      isCorrect: log.isCorrect !== undefined ? (log.isCorrect ? true : false) : null,
      timeSpentSeconds: log.timeSpentSeconds || null,
      submissionText: log.submissionText || null,
      audioUrl: log.audioUrl || null,
      criteriaScores: log.criteriaScores || null,
      notes: log.notes || null,
      createdAt: new Date(),
    }));

    for (const record of records) {
      await db.insert(ieltsPracticeLogs).values(record);
    }

    return records;
  }

  // ==========================================================================
  // MISTAKES TAXONOMY
  // ==========================================================================

  static async getAllMistakes() {
    return db.select().from(ieltsMistakes).orderBy(desc(ieltsMistakes.createdAt));
  }

  static async getMistakesBySession(sessionId: string) {
    return db
      .select()
      .from(ieltsMistakes)
      .where(eq(ieltsMistakes.sessionId, sessionId));
  }

  static async saveMistake(data: {
    id?: string;
    logId?: string;
    sessionId?: string;
    mistakeCategory: string;
    rootCauseAnalysis?: string;
    actionPlanForImprovement?: string;
    isResolved?: boolean;
  }) {
    const id = data.id || `mst_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const record = {
      id,
      logId: data.logId || null,
      sessionId: data.sessionId || null,
      mistakeCategory: data.mistakeCategory,
      rootCauseAnalysis: data.rootCauseAnalysis || null,
      actionPlanForImprovement: data.actionPlanForImprovement || null,
      isResolved: data.isResolved ?? false,
      createdAt: new Date(),
    };

    await db.insert(ieltsMistakes).values(record);
    return record;
  }

  static async updateMistake(
    id: string,
    data: Partial<{
      mistakeCategory: string;
      rootCauseAnalysis: string;
      actionPlanForImprovement: string;
      isResolved: boolean;
    }>
  ) {
    await db.update(ieltsMistakes).set(data).where(eq(ieltsMistakes.id, id));
    return { success: true, id };
  }

  // ==========================================================================
  // VOCABULARY VAULT
  // ==========================================================================

  static async getAllVocab() {
    return db.select().from(engVocab).orderBy(desc(engVocab.createdAt));
  }

  static async createVocab(data: {
    id?: string;
    materialId?: string;
    sessionId?: string;
    logId?: string;
    word: string;
    partOfSpeech?: string;
    phonetic?: string;
    primaryMeaning?: string;
    contextSentence?: string;
    synonyms?: string;
    tags?: string;
  }) {
    const id = data.id || `v_${Date.now()}`;
    const record = {
      id,
      materialId: data.materialId || null,
      sessionId: data.sessionId || null,
      logId: data.logId || null,
      word: data.word,
      partOfSpeech: data.partOfSpeech || 'noun',
      phonetic: data.phonetic || null,
      primaryMeaning: data.primaryMeaning || null,
      contextSentence: data.contextSentence || null,
      synonyms: data.synonyms || null,
      tags: data.tags || JSON.stringify(['ielts', 'academic']),
      fsrsStability: 0,
      fsrsDifficulty: 0,
      fsrsDue: new Date(),
      fsrsState: 'New',
      reps: 0,
      lapses: 0,
      elapsedDays: 0,
      scheduledDays: 0,
      lastReview: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(engVocab).values(record);
    return record;
  }

  static async deleteVocab(id: string) {
    await db.delete(engVocab).where(eq(engVocab.id, id));
    return { success: true, id };
  }

  // ==========================================================================
  // DASHBOARD KPI & ANALYTICS
  // ==========================================================================

  static async getDashboardStats() {
    await this.seedDefaultMaterialsIfEmpty();

    // 1. Fetch sessions
    const sessions = await db
      .select()
      .from(ieltsSessions)
      .orderBy(desc(ieltsSessions.startTime))
      .limit(20);

    // 2. Fetch mistakes
    const mistakes = await db.select().from(ieltsMistakes);

    // 3. Fetch vocab count
    const vocabItems = await db.select().from(engVocab);

    // Calculate Estimated Band (average of completed sessions with band score)
    const completedSessionsWithBand = sessions.filter(
      (s: any) => s.currentScoreBand !== null && s.currentScoreBand !== undefined && s.currentScoreBand > 0
    );

    let estimatedBand = 7.0;
    if (completedSessionsWithBand.length > 0) {
      const recent3 = completedSessionsWithBand.slice(0, 3);
      const sum = recent3.reduce((acc: number, cur: any) => acc + (cur.currentScoreBand || 0), 0);
      estimatedBand = Math.round((sum / recent3.length) * 10) / 10;
    }

    // 4 Skills breakdown
    const skills = [
      { skill: 'Listening', target: 8.5, color: '#002147', defaultCurrent: 7.5 },
      { skill: 'Reading', target: 8.5, color: '#1B4268', defaultCurrent: 7.5 },
      { skill: 'Writing', target: 7.5, color: '#D97706', defaultCurrent: 6.5 },
      { skill: 'Speaking', target: 7.5, color: '#059669', defaultCurrent: 6.5 },
    ];

    const skillBands = skills.map((sk) => {
      const skillSessions = completedSessionsWithBand.filter(
        (s: any) => s.section.toLowerCase() === sk.skill.toLowerCase()
      );
      let current = sk.defaultCurrent;
      if (skillSessions.length > 0) {
        const sum = skillSessions.reduce((acc: number, s: any) => acc + (s.currentScoreBand || 0), 0);
        current = Math.round((sum / skillSessions.length) * 10) / 10;
      }
      return {
        skill: sk.skill,
        current,
        target: sk.target,
        color: sk.color,
      };
    });

    // Mistake Taxonomy breakdown
    const categoryDescriptions: Record<string, string> = {
      Distraction: 'Bẫy đề thi, thông tin đối lập giữa bài nghe và phương án',
      Vocabulary: 'Không nhận ra từ đồng nghĩa (paraphrase) trong câu hỏi',
      'Time Management': 'Tốn quá nhiều thời gian cho đoạn đầu dẫn tới cuống ở phần sau',
      Comprehension: 'Mạch văn phức tạp chứa nhiều mệnh đề quan hệ hoặc từ nối',
      Careless: 'Vượt quá giới hạn số từ quy định hoặc sai chính tả',
      Grammar: 'Nhầm lẫn thì, dạng động từ hoặc trật tự từ',
    };

    const countsByCategory: Record<string, number> = {};
    for (const m of mistakes) {
      const cat = (m as any).mistakeCategory || 'Distraction';
      countsByCategory[cat] = (countsByCategory[cat] || 0) + 1;
    }

    const totalMistakes = mistakes.length;
    let mistakeBreakdown = Object.entries(countsByCategory).map(([category, count]) => ({
      category,
      count,
      percent: totalMistakes > 0 ? Math.round((count / totalMistakes) * 100) : 0,
      desc: categoryDescriptions[category] || 'Lỗi sai cần phân tích nguyên nhân gốc rễ',
    }));

    if (mistakeBreakdown.length === 0) {
      mistakeBreakdown = [
        { category: 'Distraction', count: 12, percent: 35, desc: categoryDescriptions.Distraction },
        { category: 'Vocabulary', count: 9, percent: 26, desc: categoryDescriptions.Vocabulary },
        { category: 'Time Management', count: 6, percent: 18, desc: categoryDescriptions['Time Management'] },
        { category: 'Comprehension', count: 4, percent: 12, desc: categoryDescriptions.Comprehension },
        { category: 'Careless', count: 3, percent: 9, desc: categoryDescriptions.Careless },
      ];
    }

    // Format recent sessions
    const formattedSessions = sessions.slice(0, 5).map((s: any) => ({
      id: s.id,
      title: s.testNumber ? `${s.testNumber}` : 'Cambridge Practice Test',
      section: s.section,
      type: s.testType === 'academic' ? 'Academic' : 'General',
      score: s.rawScore !== null ? `${s.rawScore}/${s.maxScore || 40}` : '—',
      band: s.currentScoreBand || 7.0,
      date: new Date(s.startTime).toLocaleDateString('vi-VN'),
    }));

    // If no recent sessions yet in fresh db, provide realistic guidance items
    const displaySessions =
      formattedSessions.length > 0
        ? formattedSessions
        : [
            { id: 's1', title: 'Cambridge IELTS 18 - Test 1', section: 'Reading', type: 'Academic', score: '32/40', band: 7.5, date: 'Hôm nay' },
            { id: 's2', title: 'Cambridge IELTS 18 - Test 1', section: 'Listening', type: 'Academic', score: '30/40', band: 7.0, date: 'Hôm qua' },
            { id: 's3', title: 'Cambridge IELTS 17 - Test 4', section: 'Reading', type: 'Academic', score: '28/40', band: 6.5, date: '3 ngày trước' },
          ];

    return {
      targetBand: 8.0,
      currentBand: estimatedBand,
      totalMistakes: totalMistakes > 0 ? totalMistakes : 34,
      totalVocab: vocabItems.length > 0 ? vocabItems.length : 128,
      skillBands,
      recentSessions: displaySessions,
      mistakeBreakdown,
    };
  }
}

export const ieltsRepository = IeltsRepository;
