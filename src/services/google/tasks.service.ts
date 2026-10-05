import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export interface DailyGoalTaskInput {
  dueCount: number;
  newCount: number;
}

/**
 * Service xử lý tích hợp Google Tasks (Danh sách việc cần làm / Todo List)
 */
export class GoogleTasksService {
  private static TASKLIST_TITLE = '🇯🇵 Tiếng Nhật FSRS (Mục tiêu Daruma)';

  /**
   * Tìm hoặc tạo danh sách nhiệm vụ tiếng Nhật chuyên biệt
   */
  private static async getOrCreateTaskList(tasks: any): Promise<string> {
    const listRes = await tasks.tasklists.list({ maxResults: 50 });
    const existing = (listRes.data.items || []).find(
      (item: any) => item.title === this.TASKLIST_TITLE
    );

    if (existing && existing.id) {
      return existing.id;
    }

    const createRes = await tasks.tasklists.insert({
      requestBody: {
        title: this.TASKLIST_TITLE,
      },
    });

    return createRes.data.id;
  }

  /**
   * Đồng bộ các mục tiêu học tập hôm nay vào Google Tasks
   */
  static async syncDailyGoals(
    authClient: OAuth2Client,
    goals: DailyGoalTaskInput
  ): Promise<{ taskListId: string; createdTasks: string[] }> {
    const tasks = google.tasks({ version: 'v1', auth: authClient });
    const taskListId = await this.getOrCreateTaskList(tasks);

    const todayDate = new Date();
    todayDate.setHours(23, 59, 59, 0);
    const dueDate = todayDate.toISOString();

    const createdTasks: string[] = [];

    // 1. Tạo nhiệm vụ ôn tập thẻ đến hạn
    if (goals.dueCount > 0) {
      const dueTask = await tasks.tasks.insert({
        tasklist: taskListId,
        requestBody: {
          title: `[FSRS] Ôn tập ${goals.dueCount} thẻ đến hạn hôm nay`,
          notes: 'Mở ứng dụng Japanese SRS để hoàn thành chu kỳ lặp lại ngắt quãng: https://japanese-srs-system.vercel.app/review',
          due: dueDate,
        },
      });
      createdTasks.push(dueTask.data.title || 'Ôn tập thẻ');
    }

    // 2. Tạo nhiệm vụ nạp từ mới
    if (goals.newCount > 0) {
      const newTask = await tasks.tasks.insert({
        tasklist: taskListId,
        requestBody: {
          title: `[FSRS] Nạp ${goals.newCount} từ vựng mới chuẩn i+1`,
          notes: 'Khám phá thẻ mới trong thư viện: https://japanese-srs-system.vercel.app/cards',
          due: dueDate,
        },
      });
      createdTasks.push(newTask.data.title || 'Nạp từ mới');
    }

    return {
      taskListId,
      createdTasks,
    };
  }
}
