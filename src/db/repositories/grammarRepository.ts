import { db } from '../client';
import { grammarLessons, grammarPatterns, grammarExercises, cards, decks } from '../schema';
import { eq, asc, desc, lte, inArray } from 'drizzle-orm';
import { GrammarLesson, GrammarPattern, GrammarExercise } from '@/core/grammar/grammar.types';

/**
 * GrammarRepository (Tầng truy xuất dữ liệu Ngữ pháp chuyên biệt)
 * Đảm bảo Zero Regression và tối ưu hóa hiệu năng truy vấn LibSQL/SQLite
 */
export class GrammarRepository {
  /**
   * Lấy danh sách toàn bộ bài học kèm thứ tự sắp xếp
   */
  static async getAllLessons(): Promise<any[]> {
    return db
      .select()
      .from(grammarLessons)
      .orderBy(asc(grammarLessons.lessonNumber));
  }

  /**
   * Lấy danh sách bài học kèm thống kê số thẻ đến hạn (Due) và tiến độ
   */
  static async getAllLessonsWithStats() {
    const lessons = await this.getAllLessons();
    const now = new Date();

    // Lấy thẻ ngữ pháp trong cards table nếu có
    let grammarCards: any[] = [];
    try {
      grammarCards = await db
        .select()
        .from(cards)
        .where(eq(cards.deckId, 'grammar_jpd133'));
    } catch {
      grammarCards = [];
    }

    const totalDue = grammarCards.filter(c => new Date(c.due) <= now).length;
    const totalNew = grammarCards.filter(c => c.state === 'New').length;
    const totalReview = grammarCards.filter(c => c.state === 'Review').length;

    const lessonsWithStats = lessons.map(lesson => {
      const lessonCards = grammarCards.filter(c => 
        c.tags && typeof c.tags === 'string' && c.tags.includes(`lesson-${lesson.id}`)
      );
      const dueCount = lessonCards.filter(c => new Date(c.due) <= now).length;
      const newCount = lessonCards.filter(c => c.state === 'New').length;

      return {
        ...lesson,
        stats: {
          totalCards: lessonCards.length,
          dueCards: dueCount,
          newCards: newCount,
          masteryRate: lessonCards.length > 0
            ? Math.round((lessonCards.filter(c => c.stability > 10).length / lessonCards.length) * 100)
            : 0,
        },
      };
    });

    return {
      lessons: lessonsWithStats,
      stats: {
        totalLessons: lessons.length,
        totalPatterns: lessons.reduce((sum, l) => sum + (l.patternCount || 0), 0),
        totalCards: grammarCards.length,
        dueCards: totalDue,
        newCards: totalNew,
        reviewCards: totalReview,
      },
    };
  }

  /**
   * Lấy chi tiết bài học kèm toàn bộ các patterns thuộc bài đó
   */
  static async getLessonById(lessonId: string) {
    const lessonRows = await db
      .select()
      .from(grammarLessons)
      .where(eq(grammarLessons.id, lessonId));

    if (!lessonRows || lessonRows.length === 0) return null;
    const lesson = lessonRows[0];

    const patterns = await db
      .select()
      .from(grammarPatterns)
      .where(eq(grammarPatterns.lessonId, lessonId))
      .orderBy(asc(grammarPatterns.patternNumber));

    // Parse JSON fields
    const parsedPatterns = patterns.map((p: any) => ({
      ...p,
      structureSlots: typeof p.structureSlots === 'string' ? JSON.parse(p.structureSlots) : p.structureSlots,
      examples: typeof p.examples === 'string' ? JSON.parse(p.examples) : p.examples,
      verbTypes: typeof p.verbTypes === 'string' ? JSON.parse(p.verbTypes) : p.verbTypes,
      relatedPatternIds: typeof p.relatedPatternIds === 'string' ? JSON.parse(p.relatedPatternIds) : p.relatedPatternIds,
    }));

    return {
      ...lesson,
      patterns: parsedPatterns,
    };
  }

  /**
   * Lấy chi tiết 1 pattern kèm bài tập tương ứng
   */
  static async getPatternById(patternId: string) {
    const patternRows = await db
      .select()
      .from(grammarPatterns)
      .where(eq(grammarPatterns.id, patternId));

    if (!patternRows || patternRows.length === 0) return null;
    const p: any = patternRows[0];

    const exercises = await db
      .select()
      .from(grammarExercises)
      .where(eq(grammarExercises.patternId, patternId))
      .orderBy(asc(grammarExercises.sortOrder));

    return {
      ...p,
      structureSlots: typeof p.structureSlots === 'string' ? JSON.parse(p.structureSlots) : p.structureSlots,
      examples: typeof p.examples === 'string' ? JSON.parse(p.examples) : p.examples,
      verbTypes: typeof p.verbTypes === 'string' ? JSON.parse(p.verbTypes) : p.verbTypes,
      relatedPatternIds: typeof p.relatedPatternIds === 'string' ? JSON.parse(p.relatedPatternIds) : p.relatedPatternIds,
      exercises: exercises.map((ex: any) => ({
        ...ex,
        alternateAnswers: typeof ex.alternateAnswers === 'string' ? JSON.parse(ex.alternateAnswers) : ex.alternateAnswers,
      })),
    };
  }

  /**
   * Lấy danh sách bài tập cho phiên luyện tập (Drill Practice Queue)
   */
  static async getPracticeQueue(options: { lessonId?: string; limit?: number } = {}) {
    const limit = options.limit || 15;
    
    let query = db.select().from(grammarExercises);
    
    if (options.lessonId && options.lessonId !== 'all') {
      // Tìm các pattern thuộc bài này trước
      const patterns = await db
        .select({ id: grammarPatterns.id })
        .from(grammarPatterns)
        .where(eq(grammarPatterns.lessonId, options.lessonId));

      const patternIds = patterns.map((p: any) => p.id);
      if (patternIds.length === 0) return [];

      return db
        .select()
        .from(grammarExercises)
        .where(inArray(grammarExercises.patternId, patternIds))
        .limit(limit);
    }

    return db
      .select()
      .from(grammarExercises)
      .limit(limit);
  }

  /**
   * Lấy toàn bộ danh sách mẫu ngữ pháp phục vụ Grammar Omnisearch
   */
  static async getAllPatternsSummary(): Promise<any[]> {
    try {
      const rows = await db
        .select({
          id: grammarPatterns.id,
          lessonId: grammarPatterns.lessonId,
          patternNumber: grammarPatterns.patternNumber,
          patternTemplate: grammarPatterns.patternTemplate,
          meaningVi: grammarPatterns.meaningVi,
          jlptLevel: grammarPatterns.jlptLevel,
        })
        .from(grammarPatterns)
        .orderBy(asc(grammarPatterns.lessonId), asc(grammarPatterns.patternNumber));

      return rows.map((r: any) => ({
        id: r.id,
        lessonId: r.lessonId,
        patternNumber: r.patternNumber,
        titleJa: r.patternTemplate,
        titleVi: r.meaningVi,
        romaji: '',
        jlptLevel: r.jlptLevel,
        meaning: r.meaningVi,
      }));
    } catch {
      return [];
    }
  }
}

export const grammarRepository = GrammarRepository;
